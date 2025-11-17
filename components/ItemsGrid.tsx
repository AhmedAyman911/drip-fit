// components/ItemsGridClient.tsx
'use client'
import { useProducts } from '@/hooks/useProducts'
import ItemCard from "@/components/ItemCard";
import { HTMLAttributes } from "react";
import { ProductsPagination } from './productsPagination';
import { useSearchParams } from 'next/navigation';

interface ItemsGridClientProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function ItemsGridClient({ className, title, ...props }: ItemsGridClientProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error } = useProducts(currentPage, 8, searchQuery);

  if (searchQuery != null) {
    title = `Search results for ${searchQuery}...`
  }

  if (isLoading) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {title}
        </h1>
        <p className="text-center p-8">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {title}
        </h1>
        <p className="text-center p-8 text-red-500">Error fetching products</p>
      </div>
    );
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {title}
        </h1>
        <div className="text-center p-8">No products found</div>
      </div>
    );
  }

  return (
    <>
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {title}
        </h1>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {data.products.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {data.pagination && (
          <div className="flex justify-center p-4">
            <ProductsPagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              searchQuery={searchQuery || ''}
            />
          </div>
        )}
      </div>

    </>
  );
}