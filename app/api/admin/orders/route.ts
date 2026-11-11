import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { createApiResponse } from "@/lib/apiResponse";
import { isOrderStatus } from "@/lib/orderStatus";

export async function GET(request: Request) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10") || 10));
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const where: Prisma.OrderWhereInput = {};
    if (isOrderStatus(status)) where.status = status;
    if (search) {
      where.OR = [
        { id: { startsWith: search.toLowerCase() } },
        { phoneNumber: { contains: search } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [totalCount, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, image: true } },
          items: { include: { product: true, variant: true } },
        },
      }),
    ]);

    return NextResponse.json(
      createApiResponse("admin-orders", {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(totalCount / limit)),
          totalCount,
          limit,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
