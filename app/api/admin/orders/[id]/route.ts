import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { createApiResponse } from "@/lib/apiResponse";
import { isOrderStatus } from "@/lib/orderStatus";

class StockError extends Error {}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const { status } = await request.json();

    if (!isOrderStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) return null;

      const wasCancelled = order.status === "cancelled";
      const willBeCancelled = status === "cancelled";

      // Cancelling returns the units to stock; reopening a cancelled order takes them again.
      if (wasCancelled !== willBeCancelled) {
        for (const item of order.items) {
          if (!item.variantId) continue;
          if (willBeCancelled) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          } else {
            const taken = await tx.productVariant.updateMany({
              where: { id: item.variantId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (taken.count === 0) {
              throw new StockError("Not enough stock to reopen this order");
            }
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: { status },
        include: {
          user: { select: { name: true, email: true, image: true } },
          items: { include: { product: true, variant: true } },
        },
      });
    });

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(createApiResponse("admin-order", updated));
  } catch (error) {
    if (error instanceof StockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
