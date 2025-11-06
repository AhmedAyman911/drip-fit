import { Sheet, SheetTrigger, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { items } from "@/lib/items";

export default function CartSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="hidden lg:flex w-16 h-9 border-2 text-black border-black dark:text-gray-200 dark:border-gray-200 rounded-md p-1 cursor-pointer">
                    <ShoppingCart className="text-black dark:text-gray-200" /> Cart
                </button>
            </SheetTrigger>

            <SheetTrigger asChild>
                <button className="lg:hidden flex flex-col items-center dark:text-gray-200">
                    <ShoppingCart size={24} />
                    <span className="text-xs mt-1">Cart</span>
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] lg:w-[400px] p-6 space-y-4 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <SheetHeader>
                    <h2 className="text-lg font-bold">Your Cart</h2>
                </SheetHeader>
                {items?.length > 0 ? (
                    <div className="flex flex-col gap-4 max-h-[60vh] pr-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b pb-3 mb-3"
                            >
                                <div className="flex gap-3 items-center">
                                    <Image
                                        src={Array.isArray(item.imgSrc) ? item.imgSrc[0] : item.imgSrc}
                                        alt={item.title}
                                        width={1080}
                                        height={1080}
                                        className="lg:w-32 w-20 lg:h-32 h-20 rounded-md object-cover object-top"
                                    />
                                    <div>
                                        <h3 className="font-medium text-sm">{item.title}</h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Qty: {item.quantity || 1}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm">${item.price.toFixed(2)}</p>
                                    <button className="text-xs text-red-500 hover:underline mt-1">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="pb-6">
                            <Link href="/checkout" className="w-full">
                            <Button className="w-full">Proceed to Checkout</Button>
                        </Link>
                        </div>
                        
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 items-center justify-center h-[60vh]">
                        <p className="text-gray-600 dark:text-gray-300">No items yet</p>
                        <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                )}





            </SheetContent>
        </Sheet>
    )
}