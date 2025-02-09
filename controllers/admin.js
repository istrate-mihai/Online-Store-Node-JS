const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editingMode: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title       = req.body.title;
  const imageUrl    = req.body.imageUrl;
  const description = req.body.description;
  const price       = req.body.price;

  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode  = req.query.editMode;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId, product => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editingMode: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id          = req.body.productId;
  const title       = req.body.title;
  const imageUrl    = req.body.imageUrl;
  const description = req.body.description;
  const price       = req.body.price;

  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId; 
  Product.delete(productId);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(productList => {
    res.render('admin/products', {
      prods: productList,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
