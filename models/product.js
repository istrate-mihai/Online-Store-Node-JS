const fs          = require('fs');
const path        = require('path');
const rootDir     = require('../util/rootDir');
const productFile = path.join(rootDir, 'data', 'products.json');
const Cart        = require('../models/cart');

const getProductsFromFile = cb => {
  fs.readFile(productFile, 'utf8', (err, fileContent) => {
    if (err) {
      return cb([]);
    }

    cb(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id          = id;
    this.title       = title;
    this.imageUrl    = imageUrl;
    this.description = description;
    this.price       = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        let productIndex                 = products.findIndex(p => p.id == this.id);
        let updatedProductList           = [...products];
        updatedProductList[productIndex] = this;

        fs.writeFile(productFile, JSON.stringify(updatedProductList), err => {
          console.log(err);
        });
      }
      else {
        this.id = String(Math.random());

        products.push(this);

        fs.writeFile(productFile, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static delete(productId) {
    getProductsFromFile(products => {
      let updatedProducts  = products.filter(p => p.id != productId);
      let product          = products.find(p => p.id == productId);
      const deleteFromCart = (id, price) => {
        Cart.delete(id, price);
      };
      fs.writeFile(productFile, JSON.stringify(updatedProducts), err => {
        if (err) {
          console.error(err);
          return;
        }
        deleteFromCart(productId, product.price);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id == id);
      cb(product);
    });
  }
}
