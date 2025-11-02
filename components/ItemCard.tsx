import Link from "next/link"
import Image from "next/image"

interface ItemCardProps {
    title: string;
    imgSrc: string;
    price: number;
    category: string;
    isOnSale: boolean;
    salePrice?: number
}


export default function ItemCard({ isOnSale, title, imgSrc, price, category, salePrice }: ItemCardProps) {
    return (
        <Link href={'/item'} className="flex flex-col w-80">
            <div className="relative">
                <Image alt="item img"
                    src={imgSrc}
                    width={512}
                    height={512}
                    className="object-cover"
                />
                {isOnSale && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-2xl">
                        Sale
                    </span>
                )}
            </div>
            <div className="p-3">
                <p className="text-sm text-gray-400 dark:text-gray-500">{category}</p>
                <p className="text-lg md:text-2xl font-bold">{title}</p>
                {isOnSale ?
                    <div className="flex">
                        <span className="text-md font-bold line-through">{price}</span>
                        <div className="flex px-2">
                            <span className="text-md font-bold text-red-400">{salePrice}</span>
                            <span className="text-md font-bold text-green-400">&nbsp;$</span>
                        </div>
                    </div>
                    :
                    <div className="flex">
                        <span className="text-md font-bold">{price}</span>
                        <span className="text-md font-bold text-green-400">&nbsp;$</span>
                    </div>
                }
            </div>
        </Link>
    )
}