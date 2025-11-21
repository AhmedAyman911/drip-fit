import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ItemCardSkeleton } from "./ItemCard";

export default function LandingCarouselSkeleton({ title }: { title: string }) {
    return (
        <section className="pt-12 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
                <Carousel>
                    <h2 className="md:text-left text-center md:text-3xl text-2xl font-bold mb-8 md:px-5">
                        {title}
                    </h2>
                    <CarouselContent className="px-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-8xl">
                                <ItemCardSkeleton />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}