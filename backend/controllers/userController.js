import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CONSTS from '../consts.js'
import UserModel from '../models/users.js'

// ! Get all users 

const getAll = async (req, res, next) => {
  try {
    const allUsers = await UserModel.find()
    // console.log('allusers->', allUsers)
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// ! Get individual user

const getSingle = async (req, res, next) => {
  const { id: currentUserId } = req.currentUser
  try {
    const foundUser = await UserModel.findById(currentUserId)
    if (!foundUser) {
      return res.status(404).json({ message: `User with ID ${currentUserId} could not be found` })
    }
    return res.status(200).json(foundUser)
  } catch (error) {
    next(error)
  }
}

// ! Register User 

const register = async (req, res, next) => {
  const { body: newUser } = req

  // ? Check if credentials already exist

  const emailExists = await UserModel.findOne({ email: newUser.email })
  if (emailExists) {
    return res.status(400).json({ message: 'Email address already exists' })
  }

  const usernameExists = await UserModel.findOne({ username: newUser.username })
  if (usernameExists) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  // ? Check password exists
  
  if (!newUser.username){
    return res.status(400).json({ message: 'Username field cannot be empty' })
  }

  if (!newUser.email){
    return res.status(400).json({ message: 'Email field cannot be empty' })
  }

  if (!newUser.password){
    return res.status(400).json({ message: 'Password field cannot be empty' })
  }

  // ? Check passwords match
  if (newUser.password !== newUser.confirmPassword) {
    return res.status(400).json({ message: 'Password do not match' })
  } 

  // ? Encrypt Password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newUser.password, salt)

  // ? Spread in newUser object and replace password with encrypted pw
  const createdUser = await UserModel.create({
    ...newUser,
    password: hashedPassword,
  })

  // ? Add user to db
  await UserModel.create(createdUser)

  return res.status(200).json({ message: `User: ${newUser.username} has been successfully created!` })
}

const login = async (req, res, next) => {
  const { username, password } = req.body
  try {
    
    if (req.body.username === ''){
      return res.status(400).json({ message: 'Username field cannot be empty' })
    }

    // ? Find user in db
    const user = await UserModel.findOne({ username })

    // ? If user doesn't exist
    if (!user) {
      return res.status(400).json({ message: 'Invalid user credentials' })
    }

    // ? Check passwords match
    const passwordsMatch = await bcrypt.compare(password, user.password)

    // ? If passwords don't match
    if (!passwordsMatch) {
      return res.status(400).json({ message: 'Invalid user credentials' })
    }

    // ? If all checks above are passed, generate token

    const payLoad = {
      username: user.username,
      email: user.email,
    }

    const opts = {
      expiresIn: '7 days',
    }

    const token = jwt.sign(payLoad, CONSTS.JWT_SECRET, opts)

    return res.status(200).json({ token })

  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  const { currentUser } = req
  const { id: currentUserId } = req.currentUser
  const { body: profileUpdates } = req

  try { 
    const userToUpdate = await UserModel.findById(currentUserId)
    console.log('user to update->',userToUpdate)

    if (!userToUpdate) {
      return res.status(404).json({ message: `User ${currentUserId} could not be found` })  
    }

    if (userToUpdate.username !== currentUser.username && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. You do not have the permissions to update this user' })
    }

    // ? Check passwords match
    const passwordsMatch = await bcrypt.compare(profileUpdates.password, userToUpdate.password)

    // ? If passwords don't match
    if (!passwordsMatch) {
      return res.status(404).json({ message: 'Current passwords do not match' })
    }

    // ? Check new passwords match
    if (profileUpdates.newPassword !== profileUpdates.newConfirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' })
    } 

    // ? Encrypt Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(profileUpdates.newPassword, salt)

    const updatedPassword = { password: hashedPassword }

    const updatedDocument = await UserModel.findByIdAndUpdate(currentUserId, updatedPassword, { new: true } )

    return res.status(200).json({ message: 'Password has been successfully updated!' })

  } catch (error) {
    next(error)
  }
}


const deleteProfile = async (req, res, next) => {
  // const { userId } = req.params
  const { id: currentUserId } = req.currentUser
  
  try {
    const deletedProfile = await UserModel.findByIdAndDelete(currentUserId)
    if (!deletedProfile){
      return res.status(404).json({ message: `${currentUserId} doesn't exist` })
    }
    return res.status(200).json({
      message: 'Your profile has been deleted',
    })
  } catch (error) {
    next(error)
  }
}


export default ({ getAll, getSingle, register, login, updateProfile, deleteProfile })