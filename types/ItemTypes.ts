export type Item = {
  id: string;
  title: string;
  imgSrc: string[];
  price: number;
  category: string;
  isOnSale: boolean;
  salePrice?: number;
  description?: string;
  colors: string[];
  sizes: string[];
  stock: number;
  gender: string
};
