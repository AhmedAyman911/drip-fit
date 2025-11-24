'use client'
import { useState } from "react";
import ColorsToggle from "@/components/colors";
import SizeToggle from "@/components/Sizes";
import ImgCarousel from "@/components/Product page/ImgCarousel";
import ProductAccordion from "@/components/Product page/ProductAccordion";

import { useSingleProduct } from "@/hooks/useSingleProduct";
import AddToCartButton from "./AddToCartButton";

import ProductPageSkeleton from "../skeletons/productPage";

export default function SingleItem({ id }: { id: string }) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    const { data: product, isLoading, error } = useSingleProduct(id)

    if (isLoading) return <ProductPageSkeleton />
    if (error) return <div>Error: {error.message}</div>
    if (!product) return <div>Product not found</div>

    const colors: string[] = [...new Set(product.variants?.map(v => v.color))]
    const availableSizes = selectedColor
        ? [...new Set(product.variants?.filter(v => v.color === selectedColor).map(v => v.size) ?? [])]
        : [];

    if (product) {
        {
            if (!selectedColor && colors.length > 0) {
                setSelectedColor(colors[0]);
            }
        }
    }

    const getCurrentPrice = () => {
        if (selectedColor && selectedSize) {
            const variant = product.variants?.find(
                v => v.color === selectedColor && v.size === selectedSize
            );
            if (variant) {
                const displayPrice = variant.price ?? product.price;
                const salePrice = variant.salePrice ?? (product.isOnSale ? product.salePrice : null);
                return {
                    price: displayPrice,
                    salePrice: salePrice,
                    isOnSale: salePrice !== null
                };
            }
        }
        return {
            price: product.price,
            salePrice: product.isOnSale ? product.salePrice : null,
            isOnSale: product.isOnSale
        };
    };

    const { price, salePrice, isOnSale } = getCurrentPrice();
    return (
        <div className="flex flex-col lg:flex-row gap-10 px-6 lg:px-32 lg:pt-32 pt-24 pb-10 lg:pb-0">
            <div className="relative w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm h-80 sm:max-w-md lg:max-w-lg lg:h-[512px]">
                    <ImgCarousel imgs={product.imgSrc} title={product.title} />
                </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-6 lg:w-1/2">
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                    {product.category} | {product.gender}
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold">{product.title}</h1>

                {isOnSale && salePrice ? (
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-400 line-through">
                            ${price.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-red-500">${salePrice.toFixed(2)}</span>
                    </div>
                ) : (
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        ${price.toFixed(2)}
                    </div>
                )}

                <div>
                    <p className="font-medium mb-1">Available Colors</p>
                    <ColorsToggle
                        type="single"
                        colors={colors}
                        onColorChange={(color) => { setSelectedColor(color); setSelectedSize(null) }}
                    />
                </div>

                <div>
                    <p className="font-medium mb-1">Size Options</p>
                    <SizeToggle type="single" value={selectedSize} sizes={availableSizes} onsizeChange={(size) => setSelectedSize(size)} />
                </div>

                <AddToCartButton product={product} selectedColor={selectedColor} selectedSize={selectedSize} />

                <div className="lg:mb-4">
                    <ProductAccordion productInfo={product.description || "No information available."} />
                </div>
            </div>
        </div>
    );

}