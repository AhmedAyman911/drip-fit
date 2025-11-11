import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET() {
    try {
        const sale = await prisma.product.findMany({
            where:{
                isOnSale:true
            },
            take: 8,
        });
        return NextResponse.json(createApiResponse("sale", sale));
    } catch (error) {
        console.error("Error fetching sale products:", error);
        return NextResponse.json({ error: "Failed to fetch sale products" }, { status: 500 });
    }
}