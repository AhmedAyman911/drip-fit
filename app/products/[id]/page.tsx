import { Item } from "@/types/ItemTypes";
import { items } from "@/lib/items";

import Image from "next/image";
import ColorsToggle from "@/components/colors";
import SizeToggle from "@/components/Sizes";

import { Button } from "@/components/ui/button"

export default async function ItemPage({ params }: { params: Promise<{ id: Item["id"] }> }) {
    const { id } = await params;
    const item = items.find((i) => i.id === id);

    if (!item) {
        return <p className="p-32">Item not found</p>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-10 px-6 md:px-32 pt-32 pb-10 md:pb-0">
            <div className="relative w-full md:w-1/2 flex items-center justify-center">
                <div className="relative w-[300px] h-[300] md:w-lg md:h-[512px] aspect-square">
                    <Image
                        src={item.imgSrc}
                        alt={item.title}
                        fill
                        className="object-cover object-top rounded-2xl shadow-lg"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 md:gap-6 md:w-1/2">
                <span className="text-sm text-gray-500 uppercase tracking-wider">
                    {item.category}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold">{item.title}</h1>

                {item.isOnSale ? (
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-400 line-through">
                            ${item.price}
                        </span>
                        <span className="text-2xl font-bold text-red-500">
                            ${item.salePrice}
                        </span>
                    </div>
                ) : (
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">${item.price}</div>
                )}

                <div>
                    <p className="font-medium mb-1">Available Colors</p>
                    <ColorsToggle />
                </div>

                <div>
                    <p className="font-medium mb-1">Size Options</p>
                    <SizeToggle />
                </div>

                <Button className="mt-4 w-full sm:w-auto" size="lg">
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}