import productsModel from '../models/products.model'
import response from '../utils/response'
import checkPermissions from '../utils/checkPermissions'

const create = async (req, res, next) => {
  const { id } = req

  if (!id) return next(new Error('Not logged in'))

  const isAdmin = await checkPermissions(id)

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

  if (!id) return next(new Error('Not logged in'))

  const isAdmin = await checkPermissions(id)

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

  if (!id) return next(new Error('Not logged in'))

  const isAdmin = await checkPermissions(id)

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
    res.json(response('Products found', info)) // TODO: remove cost if not admin
  })
}

const getProductInfo = (req, res, next) => {
  const { id } = req.params

  productsModel.findById(id, (err, info) => {
    if (err) return next(err)
    if (info.length === 0) return next(new Error('No product found'))
    res.json(response('Product found', info)) // TODO: remove cost if not admin
  })
}

export default { create, update, remove, getProductsList, getProductInfo }
