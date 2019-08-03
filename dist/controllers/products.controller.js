"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _products = _interopRequireDefault(require("../models/products.model"));

var _users = _interopRequireDefault(require("../models/users.model"));

var _response = _interopRequireDefault(require("../utils/response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: test for errors
const create = async (req, res, next) => {
  // TODO:  check permissions should be a imported function(users will use it as well)
  const {
    id
  } = req;
  if (!id) return next();
  let isAdmin = false;
  await _users.default.findOne({
    _id: id
  }, (err, userInfo) => {
    if (err) return next(err);
    if (userInfo.role === 'admin') isAdmin = true;
  });

  if (!isAdmin) {
    const err = new Error('Not enough permissions');
    return next(err);
  }

  const {
    name,
    description,
    images,
    price,
    cost,
    discount,
    stock,
    reviews
  } = req.body;

  _products.default.create({
    name,
    description,
    images,
    price,
    cost,
    discount,
    stock,
    reviews
  }, err => {
    if (err) return next(err);
    res.json((0, _response.default)('Product created successfully'));
  });
};

const update = async (req, res, next) => {
  const {
    id
  } = req;
  if (!id) return next();
  let isAdmin = false;
  await _users.default.findOne({
    _id: id
  }, (err, userInfo) => {
    if (err) return next(err);
    if (userInfo.role === 'admin') isAdmin = true;
  });

  if (!isAdmin) {
    const err = new Error('Not enough permissions');
    return next(err);
  }

  const {
    name,
    description,
    images,
    price,
    cost,
    discount,
    stock,
    reviews
  } = req.body;
  if (!req.body.id) return next(new Error('No product selected'));
  const updateQuery = {};
  if (name) updateQuery.name = name;
  if (description) updateQuery.description = description;
  if (images) updateQuery.images = images;
  if (price) updateQuery.price = price;
  if (cost) updateQuery.cost = cost;
  if (discount) updateQuery.discount = discount;
  if (stock) updateQuery.stock = stock;
  if (reviews) updateQuery.reviews = reviews;

  _products.default.findByIdAndUpdate(req.body.id, updateQuery, {
    new: true
  }, (err, productInfo) => {
    if (err) return next(err);
    res.json((0, _response.default)('Product updated', productInfo));
  });
};

const remove = async (req, res, next) => {
  const {
    id
  } = req;
  if (!id) return next();
  let isAdmin = false;
  await _users.default.findOne({
    _id: id
  }, (err, userInfo) => {
    if (err) return next(err);
    if (userInfo.role === 'admin') isAdmin = true;
  });

  if (!isAdmin) {
    const err = new Error('Not enough permissions');
    return next(err);
  }

  _products.default.findOneAndDelete({
    _id: req.body.id
  }, err => {
    if (err) return next(err);
    res.json((0, _response.default)('Product deleted'));
  });
};

const getProductsList = (req, res, next) => {
  // const { sortBy, amount, page } = TODO:
  // res.json(req.query)
  _products.default.find(req.query, (err, info) => {
    if (err) return next(err);
    if (info.length === 0) return next(new Error('No products found'));
    res.json((0, _response.default)('Products found', info));
  });
};

const getProductInfo = (req, res, next) => {
  const {
    id
  } = req.params;

  _products.default.findById(id, (err, info) => {
    if (err) return next(err);
    if (info.length === 0) return next(new Error('No product found'));
    res.json((0, _response.default)('Product found', info));
  });
};

var _default = {
  create,
  update,
  remove,
  getProductsList,
  getProductInfo
};
exports.default = _default;