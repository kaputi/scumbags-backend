import express from 'express'

import userController from '../controllers/users.controller'

import verifyToken from '../middleware/verifyToken'

const router = express.Router()

//public routes
router.post('/create', userController.create)
router.post('/authenticate', userController.authenticate)
// private routes(needs to be logged in)
router.post('/update', verifyToken, userController.update)
router.post('/permissions', verifyToken, userController.permissions)
router.post('/list', verifyToken, userController.list)

export default router
