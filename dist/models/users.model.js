"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const saltRounds = 10;
const {
  Schema
} = _mongoose.default;
const stringTrimRequired = {
  type: String,
  trim: true,
  required: true
};
const userSchema = new Schema({
  firstName: stringTrimRequired,
  lastName: stringTrimRequired,
  email: { ...stringTrimRequired,
    unique: true
  },
  password: stringTrimRequired,
  role: {
    type: String,
    enum: ['admin', 'editor', 'user', 'reseller'],
    default: 'user'
  },
  addressBook: [String]
}); // hash password before save

userSchema.pre('save', function (next) {
  const user = this; // only hash the password if it has been modified (or is new)

  if (!user.isModified('password')) return next(); // hash the password

  _bcrypt.default.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);

    _bcrypt.default.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      return next();
    });
  });
});

var _default = _mongoose.default.model('Users', userSchema);

exports.default = _default;