"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _products = _interopRequireDefault(require("../controllers/products.controller"));

var _verifyToken = _interopRequireDefault(require("../middleware/verifyToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router(); //public routes


router.get('/list', _products.default.getProductsList);
router.get('/:id', _products.default.getProductInfo); //private routes

router.post('/create', _verifyToken.default, _products.default.create);
router.post('/update', _verifyToken.default, _products.default.update);
router.post('/remove', _verifyToken.default, _products.default.remove);
var _default = router;
exports.default = _default;