// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import OrderReceipt from "@/components/emails/OrderReceipt";
import { Prisma } from '@prisma/client';


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      message: "Orders fetched successfully",
      object: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create a new order from cart items
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { items, address } = body;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order items' },
        { status: 400 }
      );
    }

    // Validate address
    if (!address || !address.shippingAddress || !address.city || !address.postalCode || !address.country || !address.phoneNumber) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
    }

    // Validate and calculate total price
    let totalPrice = 0;
    const validatedItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const itemPrice = product.salePrice || product.price;
      totalPrice += itemPrice * item.quantity;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalPrice,
          status: 'pending',
          shippingAddress: address.shippingAddress,
          city: address.city,
          state: address.state || '',
          postalCode: address.postalCode,
          country: address.country,
          phoneNumber: address.phoneNumber,
          items: {
            create: validatedItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "onboarding@resend.dev", // Use your verified domain
        to: user.email, // Send to the user who placed the order
        subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
        react: OrderReceipt({ order: order as any }), // Pass the newly created order
      });
    } catch (emailError) {
      // Log email error but don't fail the order
      console.error('Failed to send order confirmation email:', emailError);
      // Optional: You might want to queue this for retry
    }

    return NextResponse.json({
      message: "Order created successfully",
      object: order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}