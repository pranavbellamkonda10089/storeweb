
export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[]; // Additional images for the carousel
  description: string;
  category: string;
  isPrime: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  images?: string[];
  video?: string;
  verifiedPurchase: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  password?: string; // Included for Admin Dashboard display requirements
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: Address;
}
