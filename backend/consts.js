import dotenv from 'dotenv'

dotenv.config()

const consts = {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  USER1_PASSWORD: process.env.USER1_PASSWORD,
  USER2_PASSWORD: process.env.USER2_PASSWORD,
  USER3_PASSWORD: process.env.USER3_PASSWORD,

  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/movies',
  PORT: process.env.PORT || 4500,
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',

}

console.log('>>>>>>>> Environment variables defined as followed:')
console.log(consts)

export default consts