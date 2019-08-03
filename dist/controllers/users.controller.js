"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _users = _interopRequireDefault(require("../models/users.model"));

var _response = _interopRequireDefault(require("../utils/response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: errors
const create = (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;

  _users.default.create({
    firstName,
    lastName,
    email,
    password
  }, err => {
    if (err) {
      return next(err);
    } else {
      res.json((0, _response.default)('User was added successfully'));
    }
  });
};

const authenticate = (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  _users.default.findOne({
    email
  }, async (err, userInfo) => {
    if (err) {
      return next(err);
    } else {
      if (!userInfo) {
        const error = new Error('User not found');
        return next(error);
      }

      const passwordMatch = await _bcrypt.default.compare(password, userInfo.password);

      if (passwordMatch) {
        const token = _jsonwebtoken.default.sign({
          id: userInfo._id
        }, //TODO: no se si poner el role aqui;;;;; eslint-disable-line no-underscore-dangle
        req.app.get('secretKey'), {
          expiresIn: '1h'
        });

        res.json((0, _response.default)('User found', {
          user: userInfo,
          token
        })); //TODO: remove password from userinfo probablemente los docs de findone
      } else {
        const error = new Error('Invalid password');
        return next(error);
      }
    }
  });
};

const update = (req, res, next) => {
  const {
    id
  } = req;
  if (!id) return next(); //TODO:  error

  _users.default.findOne({
    id
  }, err => {
    if (err) {
      return next(err);
    } else {
      const {
        email,
        password,
        firstName,
        lastName,
        addressBook
      } = req.body;
      const updateQuery = {};
      if (email) updateQuery.email = email;
      if (password) updateQuery.password = password;
      if (firstName) updateQuery.firstName = firstName;
      if (lastName) updateQuery.lastName = lastName;
      if (addressBook) updateQuery.addressBook = addressBook;

      _users.default.findByIdAndUpdate(id, updateQuery, {
        new: true
      }, (err, userInfo) => {
        if (!err) res.json((0, _response.default)('User updated', userInfo)); //TODO: remove pass from userInfo

        return next(err);
      });
    }
  });
};

const permissions = async (req, res, next) => {
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
    role
  } = req.body;

  if (!role) {
    const err = new Error('no role');
    return next(err);
  } // TODO: esto no deberia modificar tu id sino uno que deberias pasar en el body con role


  _users.default.findByIdAndUpdate(id, {
    role
  }, {
    new: true
  }, (err, userInfo) => {
    if (!err) res.json((0, _response.default)('User updated', userInfo)); //TODO: remove pass from userInfo

    return next(err);
  });
};

const list = async (req, res, next) => {
  const {
    id
  } = req;
  if (!id) return next(); //TODO: error

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
    filters
  } = req.body;

  _users.default.find(filters, (err, info) => {
    if (err) next(err);
    res.json({
      success: true,
      message: 'Users found',
      data: info
    });
  });
};

var _default = {
  create,
  authenticate,
  update,
  permissions,
  list
};
exports.default = _default;