export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  category: string;
  imgSrc: string[];
  isOnSale: boolean;
  colors: string[];
  sizes: string[];
  stock: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  shippingAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  address: ShippingAddress;
}