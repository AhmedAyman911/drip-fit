import ProductsFilter from "@/components/Filters";
import ItemsGrid from "@/components/ItemsGrid";

interface ProductsPageProps {
  searchParams: {
    page?: string;
  };
}
export default function ProductsPage() {
  return (
    <div>
      <div className="flex pt-20 md:px-32 flex-col md:flex-row justify-center">
        <ProductsFilter />
        
          <ItemsGrid
            title="All Products"
            className="flex-1 flex-wrap gap-4 justify-between md:justify-start md:pl-16"
          />
      </div>
    </div>
  );
}

export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;

  return {
    title: page === 1 ? 'All Products' : `All Products - Page ${page}`,
    description: 'Browse our complete collection of products',
  };
}
