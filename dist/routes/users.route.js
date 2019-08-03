"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../controllers/users.controller"));

var _verifyToken = _interopRequireDefault(require("../middleware/verifyToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router(); //public routes


router.post('/create', _users.default.create);
router.post('/authenticate', _users.default.authenticate); // private routes(needs to be logged in)

router.post('/update', _verifyToken.default, _users.default.update);
router.post('/permissions', _verifyToken.default, _users.default.permissions);
router.post('/list', _verifyToken.default, _users.default.list);
var _default = router;
exports.default = _default;