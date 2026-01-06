class Review {
  constructor({
    userId,
    userName,
    rating,     // 1–5
    comment,
  }) {
    if (rating < 1 || rating > 5) {
      throw new Error("Invalid rating");
    }

    this.userId = userId;
    this.userName = userName;
    this.rating = rating;
    this.comment = comment;

    this.createdAt = new Date();
  }
}

module.exports = Review;
