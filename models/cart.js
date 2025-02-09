const fs       = require('fs');
const path     = require('path');
const rootDir  = require('../util/rootDir');
const cartFile = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addToCart(productId, productPrice) {
    fs.readFile(cartFile, 'utf8', (err, data) => {
      let cart = {
        productList: [],
        totalPrice: 0,
      };

      if (!err) {
        cart = JSON.parse(data);
      }

      let productIndex = cart.productList.findIndex(p => p.id == productId);

      if (productIndex != -1) {
        let product                    = cart.productList[productIndex];
        let updatedProduct             = { ...product, qty: product.qty + 1 };
        cart.productList[productIndex] = updatedProduct;
      }
      else {
        let product = { id: productId, qty: 1 };
        cart.productList = [...cart.productList, product];
      }
      cart.totalPrice = cart.totalPrice + productPrice;

      fs.writeFile(cartFile, JSON.stringify(cart), (err) => {
        console.error(err);
      });
    });
  }

  static delete(productId, productPrice) {
    fs.readFile(cartFile, 'utf8', (err, fileContent) => {
      if (err) {
        console.error(err);
        return;
      }

      let updatedCart   = { ...JSON.parse(fileContent) };
      let product       = updatedCart.productList.find(p => p.id == productId);

      if (!product) {
        return;
      }

      let priceToReduce = product.qty * productPrice;

      updatedCart.productList = updatedCart.productList.filter(p => p.id != productId);
      updatedCart.totalPrice -= priceToReduce;

      fs.writeFile(cartFile, JSON.stringify(updatedCart), err => {
        console.error(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(cartFile, 'utf8', (err, fileContent) => {
      if (err) {
        console.error(err);
        return cb([]);
      }

      const cart = JSON.parse(fileContent)
      cb(cart);
    });
  }
}
