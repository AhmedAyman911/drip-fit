'use client'
import { toast } from "sonner"

import { useCartStore } from '@/store/cartStore'
import { Item as Product } from '@/types/ItemTypes'

import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
    product: Product
    selectedColor: string | null
    selectedSize: string | null
}

export default function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
    const addToCart = useCartStore((state) => state.addToCart)

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            if (!selectedColor && !selectedSize) {
                toast.error("Please select a color and size before adding to cart.")
            } else if (!selectedColor) {
                toast.error("Please select a color before adding to cart.")
            } else {
                toast.error("Please select a size before adding to cart.")
            }
            return
        }


        const selectedVariant = product.variants?.find(
            v => v.color === selectedColor && v.size === selectedSize
        )

        if (!selectedVariant) {
            toast.error("Selected variant not available.")
            return
        }


        if (selectedVariant.stock === 0) {
            toast.error("This variant is out of stock.")
            return
        }
        addToCart(product, selectedVariant)
        toast.success(`${product.title} added to cart!`)
    }

    const selectedVariant = selectedColor && selectedSize
        ? product.variants?.find(v => v.color === selectedColor && v.size === selectedSize)
        : null

    const isOutOfStock = selectedVariant && selectedVariant.stock === 0
    const isDisabled = !selectedColor || !selectedSize || isOutOfStock

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isDisabled || false}
            className="mt-4 w-full sm:w-auto cursor-pointer"
            size="lg">
            {isOutOfStock
                ? "Out of Stock"
                : !selectedColor || !selectedSize
                    ? "Select Options"
                    : "Add to Cart"
            }
        </Button>
    )
}