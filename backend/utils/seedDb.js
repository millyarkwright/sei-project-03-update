import mongoose from 'mongoose'
import connectToDb from './db.js'
import seedingData from './seedingData.js'
import UserModel from '../models/users.js'
import MovieModel from '../models/movies.js'

const seed = async () => {
  await connectToDb()
  console.log('Database connected')

  await mongoose.connection.db.dropDatabase()

  // ? Add users to db

  const dbUsers = await UserModel.create([
    seedingData.users.admin,
    seedingData.users.user1,
    seedingData.users.user2,
    seedingData.users.user3
  ])

  console.log('dbUsers', dbUsers)

  // ? Add movies to db

  const dbMovies = await MovieModel.create(seedingData.movies)
  
  console.log(`${dbMovies.length} movies have been created successfully in the database`)

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  console.log('Database has been reset')
  
}

seed()