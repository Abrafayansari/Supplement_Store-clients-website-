import { Category, getCategories } from '@/src/data/Product';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Images for categories
const categoryImages: Record<string, string> = {
  protein: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
  'pre-workout': 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400',
  creatine: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
  bcaa: 'https://images.unsplash.com/photo-1603078559875-80b3c99f5eb7?w=400',
  'mass-gainer': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  vitamins: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400',
  omega: 'https://images.unsplash.com/photo-1591195855210-5e8b3b0c17e2?w=400',
  energy: 'https://images.unsplash.com/photo-1580910051070-16c34d7fdd18?w=400',
  snacks: 'https://images.unsplash.com/photo-1601050695535-4c029d6110cf?w=400',
  accessories: 'https://images.unsplash.com/photo-1599058917212-5da0c4485f5c?w=400',
  other: 'https://images.unsplash.com/photo-1606312619476-7898a3ff9f2b?w=400',
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Loading categories...</p>;
  if (!categories.length) return <p className="text-center py-10">No categories found</p>;

  return (
    <section className="py-10">
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const imageKey = category.subCategory.toLowerCase().replace(/\s+/g, '-'); // map to your keys
            return (
              <Link
                key={category.subCategory}
                to={`/products?category=${category.subCategory}`}
                className="group relative overflow-hidden rounded-none bg-brand-matte aspect-[4/5] hover-lift shadow-2xl transition-luxury"
              >
                <img
                  src={categoryImages[imageKey] || 'https://source.unsplash.com/400x400/?supplement'}
                  alt={category.subCategory}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-matte via-brand-matte/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                    {category.subCategory}
                  </h3>
                  {/* Optional description if you have it */}
                  {/* {category.description && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      {category.description}
                    </p>
                  )} */}
                  <div className="w-0 group-hover:w-12 h-1 bg-brand-gold mt-4 transition-all duration-500"></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
