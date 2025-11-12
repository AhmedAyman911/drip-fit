import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item } from '@/types/ItemTypes'

interface CartItem extends Item {
    quantity: number,
    selectedColor: string,
    selectedSize: string
}

interface CartState {
    cart: CartItem[];
    addToCart: (item: Item, color: string, size: string) => void
    increase: (id: string, color: string, size: string) => void
    decrease: (id: string, color: string, size: string) => void
    remove: (id: string, color: string, size: string) => void
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item, color, size) => {
                const existing = get().cart.find(
                    (i) => i.id === item.id && i.selectedColor === color && i.selectedSize === size
                )

                if (existing) {
                    set({
                        cart: get().cart.map((i) =>
                            i.id === item.id && i.selectedColor === color && i.selectedSize === size
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    })
                } else {
                    set({
                        cart: [
                            ...get().cart,
                            { ...item, quantity: 1, selectedColor: color, selectedSize: size },
                        ],
                    })
                }
            },

            remove: (id, color, size) => {
                set({
                    cart: get().cart.filter(
                        (i) => !(i.id === id && i.selectedColor === color && i.selectedSize === size)
                    ),
                })
            },

            increase: (id, color, size) => {
                set({
                    cart: get().cart.map((i) =>
                        i.id === id && i.selectedColor === color && i.selectedSize === size
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                })
            },

            decrease: (id, color, size) => {
                const current = get().cart.find(
                    (i) => i.id === id && i.selectedColor === color && i.selectedSize === size
                )

                if (!current) return

                if (current.quantity <= 1) {
                    get().remove(id, color, size)
                } else {
                    set({
                        cart: get().cart.map((i) =>
                            i.id === id && i.selectedColor === color && i.selectedSize === size
                                ? { ...i, quantity: i.quantity - 1 }
                                : i
                        ),
                    })
                }
            },

            clearCart: () => set({ cart: [] }),

            totalItems: () =>
                get().cart.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () =>
                get().cart.reduce(
                    (sum, item) =>
                        sum + item.quantity * (item.salePrice ?? item.price),
                    0
                ),
        }),
        {
            name: "cart-storage",
        }
    )
);
