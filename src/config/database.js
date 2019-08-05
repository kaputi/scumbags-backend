import mongoose from 'mongoose'

// database
const user = 'scumbags-admin'
const pass = 'scumbags' // TODO: set proper password before going live
const port = '27017'
const mongoDB = `mongodb://localhost:${port}/scumbags`

mongoose.connect(mongoDB, {
  user,
  pass,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
})
mongoose.Promise = global.Promise

export default mongoose
