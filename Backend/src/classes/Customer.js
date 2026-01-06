import User from "./User.js";
class Customer extends User {
  constructor({ id, name, email, password }) {
    super({ id, name, email, password, role: "CUSTOMER" });

    this.membership = null;   // Free, Silver, Gold
    this.cart = [];
    this.orders = [];
    this.wishlist = [];
  }

  assignMembership(plan) {
    this.membership = plan;
    this.updatedAt = new Date();
  }

  addToCart(product, quantity = 1) {
    this.cart.push({ product, quantity });
  }

  placeOrder(order) {
    this.orders.push(order);
  }
}
export default Customer