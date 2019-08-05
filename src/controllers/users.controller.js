import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersModel from '../models/users.model'

import response from '../utils/response'

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
        const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), {
          expiresIn: '1h',
        })
        const user = { ...userInfo._doc, token, password: null }

        res.json(response('User found', user))
      } else {
        const error = new Error('Invalid password')
        return next(error)
      }
    }
  })
}

const update = (req, res, next) => {
  const { id } = req

  if (!id) return next(new Error('Not logged in'))

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
          const user = { ...userInfo._doc, password: null }
          if (!err) res.json(response('User updated', user))

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

  const { role, user } = req.body
  if (!role) return next(new Error('no role'))

  if (!user) return next(new Error('No user'))

  usersModel.findByIdAndUpdate(
    user,
    { role },
    { new: true },
    (err, userInfo) => {
      const user = { ...userInfo._doc, password: null }
      if (!err) res.json(response('User updated', user))

      return next(err)
    }
  )
}

const list = async (req, res, next) => {
  const { id } = req
  if (!id) return next(new Error('Not logged in'))
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
