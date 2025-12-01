import { Item, ProductVariant } from "./ItemTypes";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product: Item;
  variantId: string | null;
  variant: ProductVariant | null;
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
    variantId: string; 
    quantity: number;
    color: string;      
    size: string;  
  }[];
  address: ShippingAddress;
}