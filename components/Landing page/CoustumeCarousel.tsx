import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import ItemCard from "@/components/ItemCard";
import { ItemTypes } from "@/types/ItemTypes"

interface CoustumeCarouselProps {
    title: string;
    items: ItemTypes[]
}

export default function CoustumeCarousel({ title, items }: CoustumeCarouselProps) {
    return (
        <section className="pt-12 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl ">
                <Carousel>
                    <h2 className="md:text-left text-center md:text-3xl text-2xl font-bold mb-8 md:px-5">{title}</h2>
                    <CarouselContent className="px-6">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-8xl"
                            >
                                <ItemCard
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
                                    salePrice={item.salePrice}
                                    imgSrc={item.imgSrc}
                                    isOnSale={item.isOnSale}
                                    category={item.category}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
}
