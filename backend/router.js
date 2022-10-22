import express from 'express'
import moviesController from './controllers/moviesController.js'
import userController from './controllers/userController.js'
import moviePreferenceController from './controllers/moviePreferenceController.js'
import auth from './middleware/auth.js'

const router = express.Router()

// ! Health Check

router.route('/').get((req, res) => res.status(200).send('Api is running'))

// ! Movie Endpoints
router.route('/movies')
  .get(moviesController.getAll)
router.route('/movies/:movieId').get(moviesController.getSingle)


// ! User Endpoints
router.route('/users').get(userController.getAll)
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/profile')
  .get(auth, userController.getSingle)
  .put(auth, userController.updateProfile)
  .delete(auth, userController.deleteProfile)

// .put(auth, moviePreferenceController.updateMoviePreferences)

// router.route('/profile/:userId').put(userController.updatedUserInfo)

// ! Movie Preference Endpoints
router.route('/preferences/likes/:movieId')
  .put(auth, moviePreferenceController.updateLikes)
router.route('/preferences/dislikes/:movieId')
  .put(auth, moviePreferenceController.updateDislikes)
router.route('/preferences')
  .get(auth, moviePreferenceController.getUserPreferences)
router.route('/preferences/all')
  .get(moviePreferenceController.getAllUserPreferences)



export default router