export type Item = {
  id: string;
  title: string;
  imgSrc: string[];
  price: number;
  salePrice?: number;
  category: string;
  isOnSale: boolean;
  description?: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariant[];
};
export type ProductVariant = {
  id: string;
  productId: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price?: number;
  salePrice?: number;  
  createdAt: Date;
  updatedAt: Date;
};
