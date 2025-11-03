export type Item = {
  id: number;
  title: string;
  imgSrc: string;
  price: number;
  category: string;
  isOnSale: boolean;
  salePrice?: number;
};
