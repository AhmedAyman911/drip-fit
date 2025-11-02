import Navebar from "@/components/navbar";
import ItemCard from "@/components/ItemCard";

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navebar />
      <div className="pt-28 px-32 flex flex-wrap gap-10 justify-center">
        <ItemCard
          isOnSale={true}
          price={59.99}
          salePrice={39.99}
          title="Cool Sneakers"
          imgSrc="/test.jpg"
          category="Shoes"
        />
        <ItemCard
          isOnSale={false}
          price={89.99}
          title="Leather Jacket"
          imgSrc="/test.jpg"
          category="Clothing"
        />

        <ItemCard
          isOnSale={true}
          price={49.99}
          salePrice={44.99}
          title="Graphic Tee"
          imgSrc="/test.jpg"
          category="T-Shirts"
        />

        <ItemCard
          isOnSale={true}
          price={19.99}
          salePrice={14.99}
          title="Classic Cap"
          imgSrc="/test.jpg"
          category="Accessories"
        />

        <ItemCard
          isOnSale={true}
          price={59.99}
          salePrice={39.99}
          title="Cool Sneakers"
          imgSrc="/test.jpg"
          category="Shoes"
        />
      </div>
    </div>
  );
}
