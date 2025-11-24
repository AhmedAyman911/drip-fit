import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item, ProductVariant } from '@/types/ItemTypes'

interface CartItem {
    product: Item;
    variant: ProductVariant;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Item, variant: ProductVariant) => void;
    increase: (variantId: string) => void;
    decrease: (variantId: string) => void;
    remove: (variantId: string) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
    getCartItem: (variantId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product, variant) => {
                const existing = get().cart.find(
                    (item) => item.variant.id === variant.id
                );

                if (existing) {
                    set({
                        cart: get().cart.map((item) =>
                            item.variant.id === variant.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        cart: [
                            ...get().cart,
                            { product, variant, quantity: 1 },
                        ],
                    });
                }
            },

            remove: (variantId) => {
                set({
                    cart: get().cart.filter(
                        (item) => item.variant.id !== variantId
                    ),
                });
            },

            increase: (variantId) => {
                set({
                    cart: get().cart.map((item) =>
                        item.variant.id === variantId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
            },

            decrease: (variantId) => {
                const current = get().cart.find(
                    (item) => item.variant.id === variantId
                );

                if (!current) return;

                if (current.quantity <= 1) {
                    get().remove(variantId);
                } else {
                    set({
                        cart: get().cart.map((item) =>
                            item.variant.id === variantId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        ),
                    });
                }
            },

            clearCart: () => set({ cart: [] }),

            totalItems: () =>
                get().cart.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () =>
                get().cart.reduce((sum, item) => {
                    const variant = item.variant;
                    const product = item.product;
                    const price = variant.salePrice 
                        ?? variant.price 
                        ?? (product.isOnSale ? product.salePrice : null)
                        ?? product.price;
                    
                    return sum + item.quantity * price;
                }, 0),

            getCartItem: (variantId) => 
                get().cart.find((item) => item.variant.id === variantId),
        }),
        {
            name: "cart-storage",
        }
    )
);