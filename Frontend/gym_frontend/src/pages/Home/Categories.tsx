import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/Product.tsx';

const categoryImages: Record<string, string> = {
  protein: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
  creatine: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
  'pre-workout': 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400',
  'weight-loss': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  vitamins: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400',
};

const Categories = () => {
  return (
    <section className="py-10">
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.name}`}
              className="group relative overflow-hidden rounded-none bg-brand-matte aspect-[4/5] hover-lift shadow-2xl transition-luxury"
            >
              <img
                src={categoryImages[category.id]}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-matte via-brand-matte/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <span className="text-4xl mb-4 transform group-hover:scale-125 group-hover:-translate-y-2 transition-transform duration-500">{category.icon}</span>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                  {category.name}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{category.description}</p>
                <div className="w-0 group-hover:w-12 h-1 bg-brand-gold mt-4 transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;