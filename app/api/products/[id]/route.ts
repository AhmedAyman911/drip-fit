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

        const { existingVariants, newVariants, ...productData } = data;

        const updated = await prisma.$transaction(async (tx) => {
            // Update product
            await tx.product.update({
                where: { id },
                data: productData,
            });

            // Handle existing variants (update)
            if (existingVariants && Array.isArray(existingVariants) && existingVariants.length > 0) {
                const variantIds = existingVariants.map(v => v.id);

                // Verify all variants exist and belong to this product
                const existingRecords = await tx.productVariant.findMany({
                    where: {
                        id: { in: variantIds },
                        productId: id,
                    },
                    select: { id: true },
                });

                const existingIds = new Set(existingRecords.map(v => v.id));
                const missingIds = variantIds.filter(vid => !existingIds.has(vid));

                if (missingIds.length > 0) {
                    throw new Error(`Variant IDs not found or don't belong to this product: ${missingIds.join(', ')}`);
                }

                // Update each existing variant
                await Promise.all(
                    existingVariants.map((variant) => {
                        const { id: variantId, ...variantData } = variant;
                        return tx.productVariant.update({
                            where: { id: variantId },
                            data: variantData,
                        });
                    })
                );
                const updatedVariantIds = existingVariants.map(v => v.id);
                await tx.productVariant.deleteMany({
                    where: {
                        productId: id,
                        id: { notIn: updatedVariantIds },
                    },
                });
            }

            // Handle new variants (create)
            if (newVariants && Array.isArray(newVariants) && newVariants.length > 0) {
                await tx.productVariant.createMany({
                    data: newVariants.map(variant => ({
                        ...variant,
                        productId: id, // Ensure productId is set to current product
                    })),
                });
            }

            // Return updated product with all variants
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
