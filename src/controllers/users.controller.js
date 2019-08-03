import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersModel from '../models/users.model'

import response from '../utils/response'

// TODO: errors

const create = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body
  usersModel.create({ firstName, lastName, email, password }, (err) => {
    if (err) {
      return next(err)
    } else {
      res.json(response('User was added successfully'))
    }
  })
}

const authenticate = (req, res, next) => {
  const { email, password } = req.body
  usersModel.findOne({ email }, async (err, userInfo) => {
    if (err) {
      return next(err)
    } else {
      if (!userInfo) {
        const error = new Error('User not found')
        return next(error)
      }
      const passwordMatch = await bcrypt.compare(password, userInfo.password)
      if (passwordMatch) {
        const token = jwt.sign(
          { id: userInfo._id }, //TODO: no se si poner el role aqui;;;;; eslint-disable-line no-underscore-dangle
          req.app.get('secretKey'),
          { expiresIn: '1h' }
        )
        res.json(response('User found', { user: userInfo, token })) //TODO: remove password from userinfo probablemente los docs de findone
      } else {
        const error = new Error('Invalid password')
        return next(error)
      }
    }
  })
}

const update = (req, res, next) => {
  const { id } = req

  if (!id) return next() //TODO:  error

  usersModel.findOne({ id }, (err) => {
    if (err) {
      return next(err)
    } else {
      const { email, password, firstName, lastName, addressBook } = req.body
      const updateQuery = {}
      if (email) updateQuery.email = email
      if (password) updateQuery.password = password
      if (firstName) updateQuery.firstName = firstName
      if (lastName) updateQuery.lastName = lastName
      if (addressBook) updateQuery.addressBook = addressBook

      usersModel.findByIdAndUpdate(
        id,
        updateQuery,
        { new: true },
        (err, userInfo) => {
          if (!err) res.json(response('User updated', userInfo)) //TODO: remove pass from userInfo

          return next(err)
        }
      )
    }
  })
}

const permissions = async (req, res, next) => {
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

  const { role } = req.body
  if (!role) {
    const err = new Error('no role')
    return next(err)
  }

  // TODO: esto no deberia modificar tu id sino uno que deberias pasar en el body con role
  usersModel.findByIdAndUpdate(id, { role }, { new: true }, (err, userInfo) => {
    if (!err) res.json(response('User updated', userInfo)) //TODO: remove pass from userInfo

    return next(err)
  })
}

const list = async (req, res, next) => {
  const { id } = req
  if (!id) return next() //TODO: error
  let isAdmin = false

  await usersModel.findOne({ _id: id }, (err, userInfo) => {
    if (err) return next(err)
    if (userInfo.role === 'admin') isAdmin = true
  })

  if (!isAdmin) {
    const err = new Error('Not enough permissions')
    return next(err)
  }

  const { filters } = req.body
  usersModel.find(filters, (err, info) => {
    if (err) next(err)
    res.json({
      success: true,
      message: 'Users found',
      data: info,
    })
  })
}

export default { create, authenticate, update, permissions, list }
