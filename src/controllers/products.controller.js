import productsModel from '../models/products.model'
import usersModel from '../models/users.model'
import response from '../utils/response'

// TODO: test for errors

const create = async (req, res, next) => {
  // TODO:  check permissions should be a imported function(users will use it as well)
  const { id } = req

  if (!id) return next()

  let isAdmin = false

  await usersModel.findOne({ _id: id }, (err, userInfo) => {
    if (err) return next(err)
    if (userInfo.role === 'admin') isAdmin = true
  })

  if (!isAdmin) {
    const err = new Error('Not enough permissions')
    return next(err)
  }

  const {
    name,
    description,
    images,
    price,
    cost,
    discount,
    stock,
    reviews,
  } = req.body

  productsModel.create(
    { name, description, images, price, cost, discount, stock, reviews },
    (err) => {
      if (err) return next(err)
      res.json(response('Product created successfully'))
    }
  )
}

const update = async (req, res, next) => {
  const { id } = req

  if (!id) return next()

  let isAdmin = false

  await usersModel.findOne({ _id: id }, (err, userInfo) => {
    if (err) return next(err)
    if (userInfo.role === 'admin') isAdmin = true
  })

  if (!isAdmin) {
    const err = new Error('Not enough permissions')
    return next(err)
  }

  const {
    name,
    description,
    images,
    price,
    cost,
    discount,
    stock,
    reviews,
  } = req.body

  if (!req.body.id) return next(new Error('No product selected'))

  const updateQuery = {}
  if (name) updateQuery.name = name
  if (description) updateQuery.description = description
  if (images) updateQuery.images = images
  if (price) updateQuery.price = price
  if (cost) updateQuery.cost = cost
  if (discount) updateQuery.discount = discount
  if (stock) updateQuery.stock = stock
  if (reviews) updateQuery.reviews = reviews

  productsModel.findByIdAndUpdate(
    req.body.id,
    updateQuery,
    { new: true },
    (err, productInfo) => {
      if (err) return next(err)
      res.json(response('Product updated', productInfo))
    }
  )
}

const remove = async (req, res, next) => {
  const { id } = req

  if (!id) return next()

  let isAdmin = false

  await usersModel.findOne({ _id: id }, (err, userInfo) => {
    if (err) return next(err)
    if (userInfo.role === 'admin') isAdmin = true
  })

  if (!isAdmin) {
    const err = new Error('Not enough permissions')
    return next(err)
  }

  productsModel.findOneAndDelete({ _id: req.body.id }, (err) => {
    if (err) return next(err)
    res.json(response('Product deleted'))
  })
}

const getProductsList = (req, res, next) => {
  // const { sortBy, amount, page } = TODO:

  // res.json(req.query)

  productsModel.find(req.query, (err, info) => {
    if (err) return next(err)
    if (info.length === 0) return next(new Error('No products found'))
    res.json(response('Products found', info))
  })
}

const getProductInfo = (req, res, next) => {
  const { id } = req.params

  productsModel.findById(id, (err, info) => {
    if (err) return next(err)
    if (info.length === 0) return next(new Error('No product found'))
    res.json(response('Product found', info))
  })
}

export default { create, update, remove, getProductsList, getProductInfo }
