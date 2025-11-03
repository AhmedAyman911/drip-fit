import ProductsFilter from "@/components/Filters";
import ItemsGrid from "@/components/ItemsGrid";


export default function ProductsPage() {
    return (
        <div className="flex pt-20 md:px-32 flex-col md:flex-row justify-center">
            <div className=" dark:bg-gray-900 bg-gray-100">
                <ProductsFilter />
            </div>
            <div className="flex flex-wrap md:pl-16">
                <ItemsGrid />
            </div>
        </div>
    )
}