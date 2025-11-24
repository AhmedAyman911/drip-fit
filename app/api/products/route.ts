import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const gender = searchParams.get('gender')?.split(',').filter(Boolean);
    const colors = searchParams.get('colors')?.split(',').filter(Boolean);
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const category = searchParams.get('category')?.split(',').filter(Boolean);
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;

    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          title: {
            contains: search.trim(),
            mode: 'insensitive', 
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    if (gender && gender.length > 0) {
      where.gender = { in: gender };
    }

    if (category && category.length > 0) {
      where.category = { in: category };
    }

    if (colors && colors.length > 0) {
      where.variants = {
        some: {
          color: { in: colors }
        }
      };
    }

    if (sizes && sizes.length > 0) {
      if (colors && colors.length > 0) {
        where.variants = {
          some: {
            color: { in: colors },
            size: { in: sizes }
          }
        };
      } else {
        where.variants = {
          some: {
            size: { in: sizes }
          }
        };
      }
    }

    if (minPrice !== null || maxPrice !== null) {
      where.price = {};
      if (minPrice !== null) where.price.gte = minPrice;
      if (maxPrice !== null) where.price.lte = maxPrice;
    }

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        variants: true,
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
        gender: data.gender,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
