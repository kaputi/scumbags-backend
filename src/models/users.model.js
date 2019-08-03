import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 10

const { Schema } = mongoose

const stringTrimRequired = { type: String, trim: true, required: true }

const userSchema = new Schema({
  firstName: stringTrimRequired,
  lastName: stringTrimRequired,
  email: { ...stringTrimRequired, unique: true },
  password: stringTrimRequired,
  role: {
    type: String,
    enum: ['admin', 'editor', 'user', 'reseller'],
    default: 'user',
  },
  addressBook: [String],
})

// hash password before save
userSchema.pre('save', function(next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // hash the password
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      user.password = hash
      return next()
    })
  })
})

export default mongoose.model('Users', userSchema)
