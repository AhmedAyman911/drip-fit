import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET() {
    try {
        const newArrivals = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 8,
        });
        return NextResponse.json(createApiResponse("new-arrivals", newArrivals));
    } catch (error) {
        console.error("Error fetching newArrivals:", error);
        return NextResponse.json({ error: "Failed to fetch newArrivals" }, { status: 500 });
    }
}