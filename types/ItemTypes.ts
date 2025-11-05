export type Item = {
  id: string;
  title: string;
  imgSrc: string|string[];
  price: number;
  category: string;
  isOnSale: boolean;
  salePrice?: number;
  productInfo: string;
};
