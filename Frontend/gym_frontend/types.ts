// types/Product.ts
export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  subCategory?: string;
  price: number;
  size?: string;
  stock: number;
  description?: string;
  warnings: string[];
  directions?: string;
  variants: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  reviews: any[];
  cartItems: any[];
  wishlist: any[];
  orderItems: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: { productName: string; quantity: number; price: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  status?: 'Active' | 'Suspended';
  joinDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: Product;
  createdAt: string;
}
