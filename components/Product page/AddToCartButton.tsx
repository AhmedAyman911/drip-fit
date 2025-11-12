'use client'
import { toast } from "sonner"

import { useCartStore } from '@/store/cartStore'
import { Item } from '@/types/ItemTypes'

import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
    item: Item
    selectedColor: string | null
    selectedSize: string | null
}

export default function AddToCartButton({ item, selectedColor, selectedSize }: AddToCartButtonProps) {
    const addToCart = useCartStore((state) => state.addToCart)
    const handleAddToCart = () => {
        if (!selectedColor && !selectedSize) {
            toast.error("Please select a color and size before adding to cart.")
            return
        }
        if (!selectedColor && selectedSize) {
            toast.error("Please select a color before adding to cart.")
            return
        }
        if (selectedColor && !selectedSize) {
            toast.error("Please select  size before adding to cart.")
            return
        }

        addToCart(item, selectedColor ?? "", selectedSize ?? "")
        toast.success("Item has been added sucssufully ")
    }
    return (
        <Button
            onClick={handleAddToCart}
            className="mt-4 w-full sm:w-auto cursor-pointer"
            size="lg">
            Add to Cart
        </Button>
    )
}
