import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ImgCarouselProps {
    imgs: string[];
    title: string;
}

export default function ImgCarousel({ imgs, title }: ImgCarouselProps) {
    return (
        <Carousel className="w-full ">
            <CarouselContent className="-ml-2 md:-ml-4">
                {imgs.map((img, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-[90%]" >
                        <div className="relative w-full lg:h-[550px] aspect-square ">
                            <Image
                                src={img}
                                alt={`${title} - Image ${index + 1}`}
                                fill
                                className="object-cover object-top rounded-2xl shadow-lg"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="lg:block hidden">
                <CarouselPrevious />
                <CarouselNext  />
            </div>
        </Carousel>
    );
}