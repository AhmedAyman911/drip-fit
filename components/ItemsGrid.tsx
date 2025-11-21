'use client'
import { useProducts } from '@/hooks/useProducts'
import ItemCard from "@/components/ItemCard";
import { HTMLAttributes, Suspense } from "react";
import { ProductsPagination } from './productsPagination';
import { useSearchParams } from 'next/navigation';
import { ProductsGridSkeleton } from './skeletons/ItemCard';

interface ItemsGridClientProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

function ProductsContent({ className, title, ...props }: ItemsGridClientProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error } = useProducts(currentPage, 12, searchQuery);

  const displayTitle = searchQuery != null ? `Search results for ${searchQuery}...` : title;

  if (isLoading) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {displayTitle}
        </h1>
        <ProductsGridSkeleton itemCount={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {displayTitle}
        </h1>
        <p className="text-center p-8 text-red-500">Error fetching products</p>
      </div>
    );
  }

  if (!data?.products || data.products.length === 0) {
    return (
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {displayTitle}
        </h1>
        <div className="text-center p-8">No products found</div>
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
        {displayTitle}
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
  );
}

export default function ItemsGridClient({ className, title, ...props }: ItemsGridClientProps) {
  return (
    <Suspense fallback={
      <div className={className} {...props}>
        <h1 className="text-3xl md:text-5xl font-bold p-4 text-center md:text-left">
          {title}
        </h1>
        <p className="text-center p-8">Loading...</p>
      </div>
    }>
      <ProductsContent className={className} title={title} {...props} />
    </Suspense>
  );
}