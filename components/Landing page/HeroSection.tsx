import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full h-[300px] md:h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 ">
            <Image
                src="/heroSectionImg.jpg"
                alt="Hero Background"
                fill
                className="object-cover opacity-70 "
                priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
            <div className="relative z-10 text-center px-4">
                <h1 className="text-3xl md:text-6xl font-extrabold text-white">
                    Discover Your Style
                </h1>
                <p className="mt-4 text-md md:text-xl text-gray-200">
                    Exclusive streetwear, sneakers, and essentials – shop now.
                </p>
                <div className="md:pt-12 pt-4">
                    <Link
                        href={'/products'}
                        className="mt-6 bg-black dark:bg-white text-white dark:text-black md:px-6 md:py-3 px-3 py-2 rounded-lg md:text-lg text-md font-medium hover:opacity-90 transition">
                        Explore Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
