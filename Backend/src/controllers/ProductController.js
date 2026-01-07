import Product from "../classes/Product.js";

export const products = [
  new Product({
    id: "p101",
    name: "Whey Protein",
    category: "Supplement",
    subCategory: "Whey",
    brand: "MuscleMax",
    price: 20,
    size: "2lbs",
    stock: 100,
    description: "High-quality whey protein for muscle growth",
    warnings: ["Keep out of reach of children"],
    directions: "Mix 1 scoop with 200ml water or milk",
    variants: { flavor: "Chocolate" },
    images: ["whey-choco.png"],
  }),
  new Product({
    id: "p102",
    name: "Pre-Workout",
    category: "Supplement",
    subCategory: "PreWorkout",
    brand: "EnergyBoost",
    price: 35,
    size: "1lb",
    stock: 50,
    description: "Boost your energy before workouts",
    warnings: ["Do not exceed recommended dose"],
    directions: "Mix 1 scoop with 250ml water before workout",
    variants: { flavor: "Fruit Punch" },
    images: ["preworkout-fruit.png"],
  }),
  new Product({
    id: "p103",
    name: "Shaker Bottle",
    category: "Accessory",
    subCategory: "Shaker",
    brand: "FitGear",
    price: 10,
    size: "500ml",
    stock: 200,
    description: "Durable shaker bottle for protein and supplements",
    warnings: [],
    directions: "Hand wash recommended",
    variants: { color: "Blue" },
    images: ["shaker-blue.png"],
  }),
  new Product({
    id: "p104",
    name: "T-Shirt",
    category: "Apparel",
    subCategory: "TShirt",
    brand: "GymStyle",
    price: 25,
    size: "L",
    stock: 150,
    description: "Comfortable gym T-shirt",
    warnings: [],
    directions: "Machine wash cold",
    variants: { color: "Black" },
    images: ["tshirt-black.png"],
  }),
  new Product({
    id: "p105",
    name: "Protein Bar",
    category: "Snack",
    subCategory: "Bar",
    brand: "NutriSnack",
    price: 5,
    size: "60g",
    stock: 300,
    description: "High-protein snack for on-the-go",
    warnings: ["Contains nuts"],
    directions: "Consume as a snack",
    variants: { flavor: "Chocolate Peanut" },
    images: ["proteinbar-choco.png"],
  })
];

export const createProduct = (req, res) => {
  try {

    const product = new Product(req.body);

    products.push(product);

    return res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};
