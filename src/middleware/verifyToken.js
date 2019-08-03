import jwt from 'jsonwebtoken'

import secretKey from '../config/jwt.key'

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']

  if (token) {
    // remove Bearer from token
    if (token.startsWith('Bearer')) token = token.slice(7, token.length)

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        next(err)
      } else {
        req.id = decoded.id
        return next()
      }
    })
  } else {
    const err = new Error('Token not suplied')
    next(err)
  }
}

export default verifyToken
