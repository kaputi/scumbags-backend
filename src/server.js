process.title = 'scumbags-back'

import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'

//routes
import users from './routes/users.route'
import products from './routes/products.route'

//database
import mongoose from './config/database'
import secretKey from './config/jwt.key'

const PORT = process.env.PORT || '9000'

const app = express()

app.set('secretKey', secretKey) // jwt secret token

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error: ')
)

app.use(logger('dev'))

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

app.use(express.static(__dirname + './../../frontend/index.html')) //TODO: point to serves react app

app.use('api/users', users)
app.use('api/products', products)

app.use('*', (req, res, next) => {
  const err = new Error('Page not found')
  err.statusCode = 404
  next(err)
})

//handle errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message) // log error message
  if (!err.statusCode) err.statusCode = 500 // if error doesn't have status code
  res.status(err.statusCode).json(err.message) // json response
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
