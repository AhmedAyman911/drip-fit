import ItemCard from "@/components/ItemCard";
import { HTMLAttributes } from "react";

const items = [
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
  {
    id: 6,
    title: "Denim Jacket",
    price: 149.99,
    imgSrc: "/jacket.jpg",
    isOnSale: false,
    category: "Jackets",
  },
  {
    id: 7,
    title: "Urban Hoodie",
    price: 79.99,
    imgSrc: "/hoodie.jpg",
    isOnSale: false,
    category: "Hoodies",
  },
  {
    id: 8,
    title: "Vintage Leather Boots",
    price: 189.99,
    salePrice: 149.99,
    imgSrc: "/leather-boots.jpg",
    isOnSale: true,
    category: "Footwear",
  },
  {
    id: 9,
    title: "Classic Beanie",
    price: 29.99,
    imgSrc: "/beanie.jpg",
    isOnSale: false,
    category: "Accessories",
  },
  {
    id: 10,
    title: "Vintage Leather Boots",
    price: 189.99,
    salePrice: 149.99,
    imgSrc: "/leather-boots.jpg",
    isOnSale: true,
    category: "Footwear",
  },
];

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
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            salePrice={item.salePrice}
            imgSrc={item.imgSrc}
            isOnSale={item.isOnSale}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}
