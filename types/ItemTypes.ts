export type Item = {
  id: string;
  title: string;
  imgSrc: string[];
  price: number;
  salePrice?: number;
  category: string;
  isOnSale: boolean;
  description?: string;
  gender: "male" | "female" | "unisex";
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
};


export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: string;
  imgSrc: string[];
  isOnSale: boolean;
  gender: string;
  variants: CreateVariantInput[];
}

export interface CreateVariantInput {
  color: string;
  size: string;
  sku: string;
  stock: number;
  price?: number;
  salePrice?: number;
}

export type UpdateProductInput = {
  id: string;
  title: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: string;
  imgSrc: string[];
  isOnSale: boolean;
  gender: "male" | "female" | "unisex";
  existingVariants: Array<{
    id: string;
    productId: string;
    color: string;
    size: string;
    sku: string;
    stock: number;
    price?: number;
    salePrice?: number;
  }>;
  newVariants: Array<{
    productId: string;
    color: string;
    size: string;
    sku: string;
    stock: number;
    price?: number;
    salePrice?: number;
  }>;
};