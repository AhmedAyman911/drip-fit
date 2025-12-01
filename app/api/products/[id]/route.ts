import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const product = await prisma.product.findUnique({
            where: { id }, include: {
                variants: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(createApiResponse("Product", product));;
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const data = await req.json();
        
        const { variants, ...productData } = data;

        
        const updated = await prisma.$transaction(async (tx) => {
            
            await tx.product.update({
                where: { id },
                data: productData,
            });

            if (variants && Array.isArray(variants)) {
                const variantIds = variants.map(v => v.id).filter(Boolean);
                
                if (variantIds.length !== variants.length) {
                    throw new Error("All variants must have an ID");
                }

                const existingVariants = await tx.productVariant.findMany({
                    where: {
                        id: { in: variantIds },
                        productId: id,
                    },
                    select: { id: true },
                });

                const existingIds = new Set(existingVariants.map(v => v.id));
                const missingIds = variantIds.filter(vid => !existingIds.has(vid));

                if (missingIds.length > 0) {
                    throw new Error(`Variant IDs not found: ${missingIds.join(', ')}`);
                }

                await Promise.all(
                    variants.map((variant) => {
                        const { id: variantId, ...variantData } = variant;

                        return tx.productVariant.update({
                            where: { id: variantId },
                            data: variantData,
                        });
                    })
                );
            }

            return tx.product.findUnique({
                where: { id },
                include: { variants: true },
            });
        });

        return NextResponse.json(createApiResponse("Product", updated));
    } catch (error) {
        console.error(error);
        
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message }, 
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to update product" }, 
            { status: 500 }
        );
    }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
