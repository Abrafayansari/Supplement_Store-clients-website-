
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Protein' | 'Vitamins' | 'Pre-Workout' | 'Wellness';
  image: string;
  rating: number;
  description: string;
  ingredients: string[];
  variants: {
    flavors: string[];
    sizes: string[];
  };
  stock: number;
  reviews: Review[];
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
  selectedFlavor?: string;
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
  role: 'User' | 'Admin';
  status: 'Active' | 'Suspended';
  joinDate: string;
}
