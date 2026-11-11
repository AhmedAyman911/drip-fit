import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { createApiResponse } from "@/lib/apiResponse";

const LOW_STOCK_THRESHOLD = 5;
const REVENUE_DAYS = 14;

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export async function GET() {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (REVENUE_DAYS - 1));

    const [statusGroups, revenue, productCount, customerCount, stock, lowStock, recentOrders, windowOrders] =
      await Promise.all([
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.order.aggregate({
          where: { status: { not: "cancelled" } },
          _sum: { totalPrice: true },
          _count: { _all: true },
        }),
        prisma.product.count(),
        prisma.user.count({ where: { orders: { some: {} } } }),
        prisma.productVariant.aggregate({ _sum: { stock: true } }),
        prisma.productVariant.findMany({
          where: { stock: { lte: LOW_STOCK_THRESHOLD } },
          orderBy: { stock: "asc" },
          take: 8,
          select: {
            id: true,
            color: true,
            size: true,
            sku: true,
            stock: true,
            product: { select: { id: true, title: true, imgSrc: true } },
          },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
            _count: { select: { items: true } },
          },
        }),
        prisma.order.findMany({
          where: { createdAt: { gte: since }, status: { not: "cancelled" } },
          select: { createdAt: true, totalPrice: true },
        }),
      ]);

    const byDay = new Map<string, { revenue: number; orders: number }>();
    for (let i = 0; i < REVENUE_DAYS; i++) {
      const day = new Date(since);
      day.setUTCDate(since.getUTCDate() + i);
      byDay.set(dayKey(day), { revenue: 0, orders: 0 });
    }
    for (const order of windowOrders) {
      const bucket = byDay.get(dayKey(order.createdAt));
      if (bucket) {
        bucket.revenue += order.totalPrice;
        bucket.orders += 1;
      }
    }

    const statusCounts: Record<string, number> = {};
    for (const group of statusGroups) statusCounts[group.status] = group._count._all;

    return NextResponse.json(
      createApiResponse("admin-stats", {
        revenue: revenue._sum.totalPrice ?? 0,
        paidOrders: revenue._count._all,
        productCount,
        customerCount,
        unitsInStock: stock._sum.stock ?? 0,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
        statusCounts,
        lowStock,
        recentOrders,
        dailyRevenue: [...byDay.entries()].map(([date, value]) => ({ date, ...value })),
      })
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
