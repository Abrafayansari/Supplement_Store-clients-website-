import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, initialProducts } from '../data/Product.tsx';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  getNewArrivals: () => Product[];
  getBestSellers: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'supplement_store_products';

// Fix: Use React.FC to explicitly define the children prop for the ProductProvider component to resolve TS errors during usage.
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(initialProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    saveProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    saveProducts(
      products.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const getProductsByCategory = (category: string) =>
    products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const getFeaturedProducts = () => products.filter(p => p.featured);

  const getNewArrivals = () => products.filter(p => p.isNew);

  const getBestSellers = () => products.filter(p => p.bestSeller);

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getProductsByCategory,
      getFeaturedProducts,
      getNewArrivals,
      getBestSellers
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};