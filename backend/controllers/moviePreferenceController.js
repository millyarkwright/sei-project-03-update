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

// ! Get Current User Preferences
const getCurrentUserPreferences = async (req, res, next) => {
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
  console.log('REQUEST--->', req)
  try {
    const allUsers = await UserModel.find().select('username moviesLiked')
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// ! Get single user preferences
const getUserPreferences = async (req, res, next) => {
  // console.log('req', req.params)
  // const queryObj = { username: req.params.username }
  try {
    const user = await UserModel.findOne(req.params, { _id: 0, username: 1, moviesLiked: 1 })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export default {
  updateLikes,
  updateDislikes,
  getCurrentUserPreferences,
  getAllUserPreferences,
  getUserPreferences,
}