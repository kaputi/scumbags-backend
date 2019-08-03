"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// database
const mongoDB = 'mongodb://localhost:27017/scumbags';

_mongoose.default.connect(mongoDB, {
  user: 'scumbags-admin',
  pass: 'scumbags',
  // TODO: set proper password before going live
  useNewUrlParser: true
});

_mongoose.default.Promise = global.Promise;
var _default = _mongoose.default;
exports.default = _default;