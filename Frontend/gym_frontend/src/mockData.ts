
import { Product, Order, User } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nitro Whey Isolate',
    price: 54.99,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1593095191850-2a0bf3a772bf?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    description: 'Ultra-pure whey protein isolate for muscle recovery and growth.',
    ingredients: ['Whey Isolate', 'BCAAs'],
    variants: { flavors: ['Chocolate', 'Vanilla'], sizes: ['2 lbs'] },
    stock: 45,
    reviews: []
  },
  {
    id: '2',
    name: 'Ferocious Pre-Workout',
    price: 110.00,
    category: 'Pre-Workout',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e5719d38f?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    description: 'High-intensity formula to boost focus and energy.',
    ingredients: ['Caffeine', 'Beta-Alanine'],
    variants: { flavors: ['Blue Razz'], sizes: ['30 Servings'] },
    stock: 12,
    reviews: []
  },
  {
    id: '3',
    name: 'Syntha-6 Protein',
    price: 40.00,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    description: 'Premium protein matrix for muscle support.',
    ingredients: ['Whey Concentrate', 'Casein'],
    variants: { flavors: ['Cookies & Cream'], sizes: ['5 lbs'] },
    stock: 100,
    reviews: []
  },
  {
    id: '4',
    name: 'Gorilla Mode',
    price: 50.00,
    category: 'Pre-Workout',
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    description: 'Maximalist pre-workout for massive pumps.',
    ingredients: ['Citrulline', 'Creatine'],
    variants: { flavors: ['Tiger Blood'], sizes: ['40 Servings'] },
    stock: 20,
    reviews: []
  },
  {
    id: '5',
    name: 'Nutrex Mass Infusion',
    price: 20.00,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=800',
    rating: 4.2,
    description: 'Advanced weight gainer for rapid size increases.',
    ingredients: ['Carbs', 'Protein'],
    variants: { flavors: ['Vanilla'], sizes: ['12 lbs'] },
    stock: 15,
    reviews: []
  },
  {
    id: '6',
    name: 'Omega-3 Gold',
    price: 24.99,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1626202340516-906b23750841?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    description: 'Triple-strength fish oil for heart and brain health.',
    ingredients: ['Fish Oil', 'EPA/DHA'],
    variants: { flavors: ['Lemon'], sizes: ['90 Softgels'] },
    stock: 60,
    reviews: []
  },
  {
    id: '7',
    name: 'Casein Night Recovery',
    price: 45.00,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1550577624-42c745dec99c?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    description: 'Slow-digesting protein for overnight muscle repair.',
    ingredients: ['Micellar Casein'],
    variants: { flavors: ['Vanilla'], sizes: ['2 lbs'] },
    stock: 30,
    reviews: []
  },
  {
    id: '8',
    name: 'BCAA Hydra-Fuel',
    price: 29.99,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1616431945371-fc0c90494576?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    description: 'Essential aminos with electrolytes for intra-workout hydration.',
    ingredients: ['L-Leucine', 'Electrolytes'],
    variants: { flavors: ['Watermelon'], sizes: ['30 Servings'] },
    stock: 45,
    reviews: []
  },
  {
    id: '9',
    name: 'Vitamin D3 + K2',
    price: 18.00,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584017947486-53905bb6e300?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    description: 'Synergistic support for bone and cardiovascular health.',
    ingredients: ['Vitamin D3', 'Vitamin K2'],
    variants: { flavors: ['Unflavored'], sizes: ['60 Capsules'] },
    stock: 80,
    reviews: []
  },
  {
    id: '10',
    name: 'Magnesium Calm',
    price: 22.00,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    description: 'Promotes relaxation and muscle recovery.',
    ingredients: ['Magnesium Citrate'],
    variants: { flavors: ['Unflavored'], sizes: ['90 Tablets'] },
    stock: 55,
    reviews: []
  },
  {
    id: '11',
    name: 'ZMA Elite',
    price: 32.00,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1550577624-42c745dec99c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    description: 'Optimal mineral blend for sleep and recovery.',
    ingredients: ['Zinc', 'Magnesium'],
    variants: { flavors: ['Capsules'], sizes: ['90 Servings'] },
    stock: 40,
    reviews: []
  },
  {
    id: '12',
    name: 'Creatine Mono Pure',
    price: 28.00,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1517120026326-d87759a7b63b?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    description: 'The gold standard for strength and power.',
    ingredients: ['Creatine Monohydrate'],
    variants: { flavors: ['Unflavored'], sizes: ['500g'] },
    stock: 120,
    reviews: []
  },
  {
    id: '13',
    name: 'Glutamine Recovery',
    price: 25.00,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    description: 'L-Glutamine for gut health and recovery.',
    ingredients: ['L-Glutamine'],
    variants: { flavors: ['Unflavored'], sizes: ['300g'] },
    stock: 90,
    reviews: []
  },
  {
    id: '14',
    name: 'Plant Power Protein',
    price: 59.99,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    description: 'Complete plant-based protein for vegan athletes.',
    ingredients: ['Pea Protein', 'Rice Protein'],
    variants: { flavors: ['Mocha'], sizes: ['2 lbs'] },
    stock: 35,
    reviews: []
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-25',
    customerName: 'Operative Alpha',
    customerEmail: 'alpha@vigor.com',
    total: 89.98,
    status: 'Shipped',
    items: [
      { productName: 'Nitro Whey Isolate', quantity: 1, price: 54.99 },
      { productName: 'Ferocious Pre-Workout', quantity: 1, price: 34.99 }
    ]
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Commander Admin', email: 'admin@purevigor.com', role: 'Admin', status: 'Active', joinDate: '2023-01-01' },
];
