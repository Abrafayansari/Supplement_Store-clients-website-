// services/productService.ts
import axios from "axios";
import { Product } from "@/types";

export interface ProductQueryParams {
  subCategory?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  page?: number;
  limit?: number;
  inStock?: boolean;
  rating?: number;
}

export const fetchProducts = async (
  params: ProductQueryParams = {}
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const res = await axios.get("http://localhost:5000/api/getallproducts", {
    params,
  });

  // normalize backend response
  const products: Product[] = res.data.products.map((p: any) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subCategory: p.subCategory,
    price: p.price,
    size: p.size,
    stock: p.stock,
    description: p.description,
    warnings: p.warnings || [],
    directions: p.directions,
    additionalInfo: p.additionalInfo || {},
    variants: p.variants || [],
    images: p.images || [],
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    isActive: p.isActive ?? true,
    reviews: p.reviews || [],
    cartItems: p.cartItems || [],
    wishlist: p.wishlist || [],
    orderItems: p.orderItems || [],
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));

  return {
    products,
    total: res.data.total,
    page: res.data.page,
    totalPages: res.data.totalPages,
  };
};


export interface Category {
  category: string;
  subCategory: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get('http://localhost:5000/api/getcategories');
  return res.data.categories;
};