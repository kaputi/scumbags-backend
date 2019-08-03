"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _jwt = _interopRequireDefault(require("../config/jwt.key"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    // remove Bearer from token
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);

    _jsonwebtoken.default.verify(token, _jwt.default, (err, decoded) => {
      if (err) {
        next(err);
      } else {
        req.id = decoded.id;
        return next();
      }
    });
  } else {
    const err = new Error('Token not suplied');
    next(err);
  }
};

var _default = verifyToken;
exports.default = _default;