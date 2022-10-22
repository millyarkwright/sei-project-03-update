import mongoose from 'mongoose'
import CONSTS from '../consts.js'


const connectToDb = async () => {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  return mongoose.connect(CONSTS.DB_CONNECTION_STRING, opts)
}

export default connectToDb