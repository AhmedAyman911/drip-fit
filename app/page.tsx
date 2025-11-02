
import HeroSection from "@/components/Landing page/HeroSection";
import NewArrivals from "@/components/Landing page/CoustumeCarousel";
import TopSelling from "@/components/Landing page/CoustumeCarousel";


const newArrivalItems = [
  {
    id: 1,
    title: "Urban Hoodie",
    price: 79.99,
    imgSrc: "/hoodie.jpg",
    isOnSale: false,
    category: "Hoodies",
  },
  {
    id: 2,
    title: "Retro Sneakers",
    price: 129.99,
    salePrice: 99.99,
    imgSrc: "/shoes.jpg",
    isOnSale: true,
    category: "Shoes",
  },
  {
    id: 3,
    title: "Denim Jacket",
    price: 149.99,
    imgSrc: "/jacket.jpg",
    isOnSale: false,
    category: "Jackets",
  },
  {
    id: 4,
    title: "Vintage Leather Boots",
    price: 189.99,
    salePrice: 149.99,
    imgSrc: "/leather-boots.jpg",
    isOnSale: true,
    category: "Footwear",
  },
  {
    id: 5,
    title: "Classic Beanie",
    price: 29.99,
    imgSrc: "/beanie.jpg",
    isOnSale: false,
    category: "Accessories",
  },

];


export default function Home() {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-20">
        <HeroSection />
        <NewArrivals title="New Arrivals"  items={newArrivalItems}/>
        <TopSelling title="Top Selling Products"  items={newArrivalItems}/>
      </div>
    </>

  );
}
