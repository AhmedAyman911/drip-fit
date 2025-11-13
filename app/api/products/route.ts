import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const totalCount = await prisma.product.count();

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      createApiResponse("Products", {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        category: data.category,
        imgSrc: data.imgSrc,
        isOnSale: data.isOnSale ?? false,
        colors: data.colors ?? [],
        sizes: data.sizes ?? [],
        stock: data.stock ?? 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
