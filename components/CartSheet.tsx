'use client'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetClose } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useCartStore } from '@/store/cartStore'

export default function CartSheet() {

    const items = useCartStore((state) => state.cart)
    const increase = useCartStore((state) => state.increase);
    const decrease = useCartStore((state) => state.decrease);
    const remove = useCartStore((state) => state.remove);
    const totalItems = useCartStore((state) => state.totalItems());
    const totalPrice = useCartStore((state) => state.totalPrice());

    const getItemPrice = (item: typeof items[0]) => {
        return item.variant.salePrice
            ?? item.variant.price
            ?? (item.product.isOnSale ? item.product.salePrice : null)
            ?? item.product.price;
    };

    const isItemOnSale = (item: typeof items[0]) => {
        return item.variant.salePrice !== null ||
            (item.product.isOnSale && item.product.salePrice !== null);
    };

    const getOriginalPrice = (item: typeof items[0]) => {
        return item.variant.price ?? item.product.price;
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="hidden lg:flex md:flex w-16 h-9 border-2 text-black border-black dark:text-gray-200 dark:border-gray-200 rounded-md p-1 cursor-pointer">
                    <ShoppingCart className="text-black dark:text-gray-200" /> Cart
                </button>
            </SheetTrigger>

            <SheetTrigger asChild>
                <button className="lg:hidden md:hidden flex flex-col items-center dark:text-gray-200">
                    <ShoppingCart size={24} />
                    <span className="text-xs mt-1">Cart</span>
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] lg:w-[400px] p-6 flex flex-col bg-gray-100 dark:bg-gray-900">
                <SheetHeader className="shrink-0 border-b">
                    <h2 className="text-lg font-bold">Your Cart</h2>
                </SheetHeader>
                {items?.length > 0 ? (
                    <>
                        <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 my-4">
                            {items.map((item) => {
                                const currentPrice = getItemPrice(item);
                                const onSale = isItemOnSale(item);
                                const originalPrice = getOriginalPrice(item);

                                return (
                                    <div
                                        key={item.variant.id}
                                        className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <Image
                                                src={Array.isArray(item.product.imgSrc) ? item.product.imgSrc[0] : item.product.imgSrc}
                                                alt={item.product.title}
                                                width={120}
                                                height={120}
                                                className="w-20 h-20 lg:w-28 lg:h-28 rounded-md object-cover object-top shadow-sm"
                                            />

                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    {item.product.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Color: <span className="capitalize">{item.variant.color}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Size: <span className="capitalize">{item.variant.size}</span>
                                                </p>

                                                <div className="flex items-center gap-1 mt-2">
                                                    <button
                                                        onClick={() => decrease(item.variant.id)}
                                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-bold transition"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="text-sm font-medium text-gray-800 dark:text-white min-w-5 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => increase(item.variant.id)}
                                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-bold transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex-col">
                                            {onSale ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="font-semibold text-sm lg:text-base text-gray-400 line-through">
                                                        ${originalPrice.toFixed(2)}
                                                    </span>
                                                    <span className="font-semibold text-sm lg:text-base text-red-500">
                                                        ${currentPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-sm lg:text-base text-gray-900 dark:text-gray-100">
                                                    ${currentPrice.toFixed(2)}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => remove(item.variant.id)}
                                                className="ml-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 font-medium transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex flex-col gap-2 mb-4">
                                <p className="text-gray-700 dark:text-gray-300">Total Items: {totalItems}</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Total Price: ${totalPrice.toFixed(2)}</p>
                            </div>
                            <Link href="/checkout" className="w-full">
                                <SheetClose>
                                    <Button className="w-full">Proceed to Checkout</Button>
                                </SheetClose>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 items-center justify-center flex-1">
                        <p className="text-gray-600 dark:text-gray-300">No items yet</p>
                        <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                )}

            </SheetContent>
        </Sheet>
    )
}