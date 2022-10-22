import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  actors: { type: Array, required: true },
  desc: { type: String, required: true },
  directors: { type: Array, required: true },
  genre: { type: Array, required: true },
  image_url: { type: String, required: true },
  thumb_url: { type: String, required: true },
  imdb_url: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
})

export default mongoose.model('Movie', movieSchema)