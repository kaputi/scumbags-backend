"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _users = _interopRequireDefault(require("./routes/users.route"));

var _products = _interopRequireDefault(require("./routes/products.route"));

var _database = _interopRequireDefault(require("./config/database"));

var _jwt = _interopRequireDefault(require("./config/jwt.key"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.title = 'scumbags-back';
const PORT = process.env.PORT || '9000';
const app = (0, _express.default)();
app.set('secretKey', _jwt.default); // jwt secret token

_database.default.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use((0, _morgan.default)('dev'));
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json()); // app.use(express.static(__dirname + './../../frontend/build/index.html'))

app.use('/api/users', _users.default);
app.use('/api/products', _products.default);
app.use('*', (req, res, next) => {
  const err = new Error('Page not found');
  err.statusCode = 404;
  next(err);
}); //handle errors
// eslint-disable-next-line no-unused-vars

app.use((err, req, res, next) => {
  console.error(err.message); // log error message

  if (!err.statusCode) err.statusCode = 500; // if error doesn't have status code

  res.status(err.statusCode).json(err.message); // json response
});
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});