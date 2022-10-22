import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  moviesLiked: { type: [mongoose.Schema.ObjectId], ref: 'Movies', default: [] },
  moviesDisliked: { type: [mongoose.Schema.ObjectId], ref: 'Movies', default: [] },
  createdAt: { type: Date, default: Date.now() },
})

export default mongoose.model('User', userSchema)
