import Link from "next/link";
import Image from "next/image";
import { Item } from "@/types/ItemTypes";

export default function ItemCard({ item }: { item: Item }) {



  return (
    <Link href={`/products/${item.id}`} className="flex flex-col md:w-80 w-64">
      <div className="relative aspect-square overflow-hidden">
        <Image alt={item.title} src={item.imgSrc[0]} fill className="object-cover object-top rounded-2xl" />
        {item.isOnSale && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-2xl">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {item.category}
        </p>
        <p className="text-lg md:text-2xl font-bold">{item.title}</p>
        {item.isOnSale ? (
          <div className="flex">
            <span className="text-md font-bold line-through">{item.price}</span>
            <div className="flex px-2">
              <span className="text-md font-bold text-red-400">
                {item.salePrice}
              </span>
              <span className="text-md font-bold text-green-400">&nbsp;$</span>
            </div>
          </div>
        ) : (
          <div className="flex">
            <span className="text-md font-bold">{item.price}</span>
            <span className="text-md font-bold text-green-400">&nbsp;$</span>
          </div>
        )}
      </div>
    </Link>
  );
}
