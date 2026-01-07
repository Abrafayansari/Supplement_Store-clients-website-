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

 addToCart(productid, quantity = 1) {

quantity = Number(quantity); // ensure integer
  if (isNaN(quantity) || quantity <= 0) quantity = 1;

  const existingItem = this.cart.find(
    item => item.productid === productid
  );

  if (existingItem) {
         existingItem.quantity+= quantity;
  } else {
    this.cart.push({
      productid,
      quantity
    });
  }

  this.updatedAt = new Date();
}

removefromcart(productid){
  this.cart = this.cart.filter(p => p.productid !== productid);
  this.updatedAt = new Date();
}

  placeOrder(order) {
    this.orders.push(order);
  }


addToWishlist(productid) {
  if (this.wishlist.some(item => item.productid === productid)) return;
  this.wishlist.push({ productid });
  this.updatedAt = new Date();
}


removeFromWishlist(productid) {
  this.wishlist = this.wishlist.filter(p => p.productid !== productid);
  this.updatedAt = new Date();
}

}
export default Customer