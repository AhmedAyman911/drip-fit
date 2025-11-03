import ProductsFilter from "@/components/Filters";
import ItemsGrid from "@/components/ItemsGrid";

export default function ProductsPage() {
  return (
    <div className="flex pt-20 md:px-32 flex-col md:flex-row justify-center">
      <ProductsFilter />
      <ItemsGrid
        title="All Products"
        className="flex-1 flex-wrap gap-4 justify-center md:justify-start pl-16"
      />
    </div>
  );
}
