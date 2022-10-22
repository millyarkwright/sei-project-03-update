import UserModel from '../models/users.js'

// ! Create Preferences

const updateLikes = async (req, res, next) => {
  const { movieId } = req.params
  const { id: currentUserId } = req.currentUser

  console.log('currentUserId->', currentUserId)

  try {
    const user = await UserModel.findById(currentUserId)
    user.moviesLiked.push(movieId)
    await user.save()
    return res.status(200).json({ message: 'Preference successfully updated' })
  } catch (error) {
    next(error)
  }
}

const updateDislikes = async (req, res, next) => {
  const { movieId } = req.params
  const { id: currentUserId } = req.currentUser

  try {
    const user = await UserModel.findById(currentUserId)
    user.moviesDisliked.push(movieId)
    await user.save()
    return res.status(200).json({ message: 'Preference successfully updated' })
  } catch (error) {
    next(error)
  }
}

// ! Get Single User Preferences
const getUserPreferences = async (req, res, next) => {
  const { id: currentUserId } = req.currentUser
  try {
    const user = await UserModel.findById(currentUserId)
    const { moviesLiked, moviesDisliked } = user
    return res.status(200).json({ moviesLiked: `${moviesLiked}`, moviesDisliked: `${moviesDisliked}` })
  } catch (error) {
    next(error)
  }
}

// ! Get all users preferences
const getAllUserPreferences = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find().select('username moviesLiked')
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default {
  updateLikes,
  updateDislikes,
  getUserPreferences,
  getAllUserPreferences,
}