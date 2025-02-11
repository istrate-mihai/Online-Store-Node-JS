const Product = require('../models/product');
const Cart    = require('../models/cart');

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fields]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'Product List',
      path: '/products',
    });
  }).catch(err => {
    console.error(err);
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows, fields]) => {
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/',
    });
  }).catch(err => {
    console.error(err);
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then(([rows, fields]) => {
    res.render('shop/product-detail', {
      product: rows[0],
      pageTitle: rows[0].title,
      path: '/products',
    });
  })
  .catch(err => {
    console.error(err);
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {

    Product.fetchAll(products => {
      let cartToDisplay = [];

      if (products.length && cart) {
        for (let product of products) {
          const productInCart = cart.productList.find(p => p.id == product.id);
          if (productInCart) {
            cartToDisplay.push({ productData: product, qty: productInCart.qty });
          }
        }
      }
      res.render('shop/cart', {
        path: '/checkout',
        pageTitle: 'Checkout',
        path: '/cart',
        cartToDisplay: cartToDisplay,
        totalPrice: cart.totalPrice,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId, product => {
    Cart.addToCart(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.delete(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
