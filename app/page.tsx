import Navebar from "@/components/navbar";
import ItemCard from "@/components/ItemCard";

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navebar />
      <div className="pt-28 px-32 flex flex-wrap gap-10 justify-center">
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </div>
  );
}
