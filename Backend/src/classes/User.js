 class User {
  constructor({ id, name, email, password, role }) {
    if (this.constructor === User) {
      throw new Error("User is abstract and cannot be instantiated directly");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // must be hashed in real backend
    this.role = role;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}

export default User