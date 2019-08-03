"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const response = (message, data = null) => ({
  success: true,
  message,
  data
});

var _default = response;
exports.default = _default;