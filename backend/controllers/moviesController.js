import MovieModel from '../models/movies.js'

// ! Get all movies 

const getAll = async (req, res, next) => {
  try {
    const allMovies = await MovieModel.find()
    return res.status(200).json(allMovies)
  } catch (error) {
    next(error)
  }
}

// ! Get Movie Single

const getSingle = async (req, res, next) => { 
  const { movieId } = req.params

  try {
    const foundMovie = await MovieModel.findById(movieId)
    if (!foundMovie) {
      return res.status(404).json({ message: `Movie with ID ${movieId} could not be found` })
    }
    return res.status(200).json(foundMovie)
  } catch (error) {
    next(error)
  }
}


export default {
  getAll,
  getSingle,
}