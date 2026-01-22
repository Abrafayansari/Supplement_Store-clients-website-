class Product {
  constructor({
    id,
    name,
    category,        // Supplement | Apparel | Accessory | Snack
    subCategory,     // Whey | PreWorkout | TShirt | Shaker
    brand,

    price,
    size,            // 2lbs, 5lbs, XL, Medium
    stock,

    description,
    warnings = [],
    directions = "",
    variants = [],   // array of variant names (e.g. flavors)
    images = [],

    reviews = [],
    rating = 0,

    isActive = true,
  }) {
    // ---- Validation ----
    if (!name || !price || !category) {
      throw new Error("Missing required product fields");
    }

    this.id = id;
    this.name = name;
    this.brand = brand;

    this.category = category;
    this.subCategory = subCategory;

    this.price = price;
    this.size = size;
    this.stock = stock;

    this.description = description;
    this.warnings = warnings;
    this.directions = directions;
    this.variants = variants;
    this.images = images;

    this.reviews = reviews;
    this.rating = rating;

    this.isActive = isActive;

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // ---------- BUSINESS LOGIC ----------

  applyDiscount(percent) {
    if (percent <= 0 || percent > 80) {
      throw new Error("Invalid discount");
    }
    this.price -= (this.price * percent) / 100;
    this.updatedAt = new Date();
  }

  updateStock(quantity) {
    if (quantity < 0) throw new Error("Invalid stock value");
    this.stock = quantity;
    this.updatedAt = new Date();
  }

  addReview(review) {
    this.reviews.push(review);
    this.recalculateRating();
  }

  recalculateRating() {
    if (this.reviews.length === 0) {
      this.rating = 0;
      return;
    }

    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
  }

  deactivate() {
    this.isActive = false;
  }
}

export default Product;
