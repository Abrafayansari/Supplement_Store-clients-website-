export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'protein' | 'creatine' | 'pre-workout' | 'weight-loss' | 'vitamins' | 'accessories';
  stock: number;
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  rating: number;
  reviews: number;
  flavor?: string;
  size?: string;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Elite Whey Protein',
    description: 'Premium whey protein isolate for maximum muscle growth and recovery. 25g protein per serving with minimal fat and carbs.',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    category: 'protein',
    stock: 50,
    featured: true,
    isNew: false,
    bestSeller: true,
    rating: 4.8,
    reviews: 234,
    flavor: 'Chocolate',
    size: '2 lbs'
  },
  {
    id: '2',
    name: 'Creatine Monohydrate',
    description: 'Pure micronized creatine monohydrate for explosive strength and power. 5g per serving, 60 servings per container.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800',
    category: 'creatine',
    stock: 75,
    featured: true,
    isNew: true,
    bestSeller: false,
    rating: 4.9,
    reviews: 189
  },
  {
    id: '3',
    name: 'Nitro Surge Pre-Workout',
    description: 'Explosive energy and focus formula with beta-alanine, caffeine, and L-citrulline for intense workouts.',
    price: 44.99,
    originalPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800',
    category: 'pre-workout',
    stock: 40,
    featured: true,
    isNew: false,
    bestSeller: true,
    rating: 4.7,
    reviews: 312,
    flavor: 'Blue Raspberry'
  },
  {
    id: '4',
    name: 'Thermogenic Fat Burner',
    description: 'Advanced thermogenic formula to boost metabolism and support fat loss. Contains green tea extract and L-carnitine.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: 'weight-loss',
    stock: 60,
    featured: false,
    isNew: true,
    bestSeller: false,
    rating: 4.5,
    reviews: 156
  },
  {
    id: '5',
    name: 'Mass Gainer Pro',
    description: 'High-calorie mass gainer with 50g protein and 250g carbs per serving for serious muscle building.',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    category: 'protein',
    stock: 30,
    featured: true,
    isNew: false,
    bestSeller: true,
    rating: 4.6,
    reviews: 178,
    flavor: 'Vanilla',
    size: '5 lbs'
  },
  {
    id: '6',
    name: 'BCAA Energy',
    description: 'Branched-chain amino acids with natural caffeine for endurance and recovery during intense training.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'pre-workout',
    stock: 80,
    featured: false,
    isNew: true,
    bestSeller: false,
    rating: 4.4,
    reviews: 98,
    flavor: 'Watermelon'
  },
  {
    id: '7',
    name: 'Casein Protein',
    description: 'Slow-release casein protein for overnight muscle recovery. 24g protein per serving.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=800',
    category: 'protein',
    stock: 45,
    featured: false,
    isNew: false,
    bestSeller: false,
    rating: 4.7,
    reviews: 134,
    flavor: 'Chocolate Peanut Butter',
    size: '2 lbs'
  },
  {
    id: '8',
    name: 'Creatine HCL',
    description: 'Highly concentrated creatine hydrochloride for better absorption and no bloating.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
    category: 'creatine',
    stock: 55,
    featured: true,
    isNew: false,
    bestSeller: true,
    rating: 4.8,
    reviews: 267
  },
  {
    id: '9',
    name: 'Appetite Control',
    description: 'Natural appetite suppressant with glucomannan and green coffee extract for weight management.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    category: 'weight-loss',
    stock: 70,
    featured: false,
    isNew: false,
    bestSeller: false,
    rating: 4.3,
    reviews: 89
  },
  {
    id: '10',
    name: 'Multi-Vitamin Elite',
    description: 'Complete daily multivitamin with essential vitamins and minerals for optimal health.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800',
    category: 'vitamins',
    stock: 100,
    featured: false,
    isNew: true,
    bestSeller: false,
    rating: 4.6,
    reviews: 145
  },
  {
    id: '11',
    name: 'Omega-3 Fish Oil',
    description: 'High-potency omega-3 fatty acids for heart health and joint support. 1000mg EPA/DHA per serving.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800',
    category: 'vitamins',
    stock: 90,
    featured: false,
    isNew: false,
    bestSeller: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '12',
    name: 'Plant-Based Protein',
    description: 'Vegan protein blend from pea, rice, and hemp. 22g protein per serving with complete amino profile.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800',
    category: 'protein',
    stock: 35,
    featured: true,
    isNew: true,
    bestSeller: false,
    rating: 4.5,
    reviews: 112,
    flavor: 'Vanilla Bean',
    size: '2 lbs'
  }
];

export const categories = [
  { id: 'protein', name: 'Protein', icon: '💪', description: 'Build muscle & recover faster' },
  { id: 'creatine', name: 'Creatine', icon: '⚡', description: 'Explosive strength & power' },
  { id: 'pre-workout', name: 'Pre-Workout', icon: '🔥', description: 'Energy & focus for training' },
  { id: 'weight-loss', name: 'Weight Loss', icon: '🎯', description: 'Burn fat & boost metabolism' },
  { id: 'vitamins', name: 'Vitamins', icon: '💊', description: 'Essential daily nutrition' },
];
