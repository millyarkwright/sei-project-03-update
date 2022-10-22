const errorHandler = (error, req, res) => {
  console.log(`Server side error: ${error}`)
  console.log(`Error Name: ${error.name}`)
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ObjectID' })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid JsonWebToken' })
  }

  return res.status(500).send('Something went wrong')
}

export default errorHandler 