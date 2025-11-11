import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import ItemCard from "@/components/ItemCard";
import { Item } from "@/types/ItemTypes"

interface CoustumeCarouselProps {
    title: string;
    products: Item[]
}

export default function CoustumeCarousel({ title, products }: CoustumeCarouselProps) {
    return (
        <section className="pt-12 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl ">
                <Carousel>
                    <h2 className="md:text-left text-center md:text-3xl text-2xl font-bold mb-8 md:px-5">{title}</h2>
                    <CarouselContent className="px-6">
                        {products.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="basis-8xl"
                            >
                                <ItemCard key={item.id} item={item} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>

                </Carousel>
            </div>
        </section>
    );
}
