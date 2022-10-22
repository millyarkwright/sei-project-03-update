import jwt from 'jsonwebtoken'
import CONSTS from '../consts.js'
import UserModel from '../models/users.js'

const auth = async (req, res, next) => {
  const rawToken = req.headers.authorization
  if (!rawToken) {
    return res.status(401).json({ message: 'No Token Provided' })
  }
  const token = rawToken.split(' ')[1]
  try {
    
    const decodedToken = jwt.verify(token, CONSTS.JWT_SECRET)

    console.log('decodedToken->', decodedToken)

    const authUser = await UserModel.findOne({
      username: decodedToken.username,
    })

    if (!authUser) {
      return res.status(401).json({
        message: 'Token affiliated to user that does not exist anymore',
      })
    }
    req.currentUser = authUser
    next()
  } catch (error) {
    next(error)
  }
}

export default auth
//   console.log(Object.keys(req.headers))
