import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderReceipt from "@/components/emails/OrderReceipt";
import { Order } from "@/types/orderTypes";

const dummyOrder: Order = {
    id: "clx1a2b3c4d5e6f7g8h9i0j1",
    userId: "user123",
    totalPrice: 299.97,
    status: "pending",
    shippingAddress: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phoneNumber: "+1 (555) 123-4567",
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
        {
            id: "item1",
            orderId: "clx1a2b3c4d5e6f7g8h9i0j1",
            productId: "prod1",
            quantity: 2,
            price: 49.99,
            product: {
                id: "prod1",
                title: "Classic Cotton T-Shirt",
                category: "Clothing",
                gender: "Unisex",
                price: 49.99,
                salePrice: undefined,
                stock: 100,
                imgSrc: [
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                ],
                description: "Comfortable cotton t-shirt",
                isOnSale: false,
                colors: ["White", "Black", "Gray"],
                sizes: ["S", "M", "L", "XL"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        },
        {
            id: "item2",
            orderId: "clx1a2b3c4d5e6f7g8h9i0j1",
            productId: "prod2",
            quantity: 1,
            price: 199.99,
            product: {
                id: "prod2",
                title: "Premium Leather Jacket",
                category: "Outerwear",
                gender: "Men",
                price: 199.99,
                salePrice: undefined,
                stock: 50,
                imgSrc: [
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
                ],
                description: "Stylish leather jacket",
                isOnSale: false,
                colors: ["Brown", "Black"],
                sizes: ["M", "L", "XL"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        },
    ],
};

export async function GET() {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "ahmedayman9113@gmail.com",
            subject: "test resend",
            react: OrderReceipt({ order: dummyOrder }),
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: JSON.stringify(error),
        });
    }
}
