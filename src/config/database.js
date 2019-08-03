import mongoose from 'mongoose'

// database
const mongoDB = 'mongodb://localhost:27017/scumbags'

mongoose.connect(mongoDB, {
  user: 'scumbags-admin',
  pass: 'scumbags', // TODO: set proper password before going live
  useNewUrlParser: true,
})
mongoose.Promise = global.Promise

export default mongoose
