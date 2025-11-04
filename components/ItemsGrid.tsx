import ItemCard from "@/components/ItemCard";
import { HTMLAttributes } from "react";

import { items } from "@/lib/items";

interface ItemsGridProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}
export default function ItemsGrid({
  className,
  title,
  ...props
}: ItemsGridProps) {
  return (
    <div className={className} {...props}>
      <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
        {title}
      </h1>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start ">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
