import User from "./User.js";

class Admin extends User {
  constructor({ id, name, email, password }) {
    super({ id, name, email, password, role: "ADMIN" });
  }

  // Admin-only methods
  createProduct(productData, ProductClass) {
    return new ProductClass(productData);
  }

  deactivateUser(user) {
    user.deactivate();
  }

  // You can add more like updateProduct, viewOrders etc.
}

export default Admin
