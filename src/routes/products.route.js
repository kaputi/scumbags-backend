import express from 'express'

import productsController from '../controllers/products.controller'

import verifyToken from '../middleware/verifyToken'

const router = express.Router()

//public routes
router.get('/list', productsController.getProductsList)
router.get('/:id', productsController.getProductInfo)
//private routes
router.post('/create', verifyToken, productsController.create)
router.post('/update', verifyToken, productsController.update)
router.post('/remove', verifyToken, productsController.remove)

export default router
