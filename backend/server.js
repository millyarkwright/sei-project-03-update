import express from 'express'
import router from './router.js'
import cors from 'cors'
import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'
import connectToDb from './utils/db.js'
import CONSTS from './consts.js'

// ! Define Express App
const app = express()

// ! Allow requests from anywhere
app.use(cors())

// ! Convert request into valid JSON object
app.use(express.json())

// ! Middleware
app.use(logger)
app.use(router)
app.use(errorHandler)

// ! Catching anything that falls through to this point
app.use((req, res) => {
  return res.status(404).send('Required endpoint not found')
})

// ! Start Server

const startServer = async () => {

  await connectToDb()
  console.log('Database has connected successfully')

  app.listen(CONSTS.PORT, () => {
    console.log(`Express server running on port ${CONSTS.PORT}`)
  })

}

startServer()