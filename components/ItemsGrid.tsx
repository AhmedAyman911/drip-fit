'use client'
import { useProducts } from '@/hooks/useProducts'
import ItemCard from "@/components/ItemCard";
import { HTMLAttributes } from "react";

interface ItemsGridProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function ItemsGrid({ className, title, ...props }: ItemsGridProps) {

  const { data: products, isLoading, error} = useProducts()
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error fetching products</p>
  if (!products) return <div className="flex flex-wrap gap-4 justify-center md:justify-start">Products not found</div>
  return (
    <div className={className} {...props}>
      <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
        {title}
      </h1>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start ">
        {products.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
