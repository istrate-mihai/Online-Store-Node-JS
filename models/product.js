const Cart     = require('../models/cart');
const database = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id          = id;
    this.title       = title;
    this.imageUrl    = imageUrl;
    this.description = description;
    this.price       = price;
  }

  save() {
    return database.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl],
    );
  }

  static delete() {}

  static fetchAll() {
    return database.execute('SELECT * FROM products');
  }

  static findById(id) {
    return database.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }
}
