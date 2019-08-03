import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  images: [Object],
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  reviews: String,
})

export default mongoose.model('Products', productSchema)
