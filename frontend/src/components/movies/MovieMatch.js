import {useState, useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { API_URL } from "../../config.js"
import axios from 'axios'
import NeedToLogIn from '../helpers/redirect.js'

const Match = () => {

  const navigate = useNavigate()

  // ! State
  const [userData, setUserData] = useState()
  const [allUsersAndTheirLikes, setAllUsersAndTheirLikes] = useState([])
  const [watchWith, setWatchWith] = useState({username: ''})
  const [error, setError] = useState()
  const [errorStatus, setErrorStatus] = useState()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/profile`)
        setUserData(data)
      } catch (error) {
        setError(error)
        setErrorStatus(error.response.status)
      }
    }
    getUserData()
  }, [])

  // Get all user preferences
  useEffect(() => {
    const getAllUsersAndTheirLikes = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/preferences/all`)
        setAllUsersAndTheirLikes(data)
      } catch (error) {
        setError(setError)
        setErrorStatus(error.response.status)
      }
    }
    getAllUsersAndTheirLikes()
  }, [])

  // ! Executions

  const handleFieldChange = (event) => {
    const newObj = { ...watchWith, [event.target.name]: event.target.value}
    setWatchWith(newObj)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // ERROR TEST
    const foundUser = allUsersAndTheirLikes.find(user => watchWith.username === user.username)
    if (foundUser) {
      const userMoviesLiked = userData.moviesLiked
      const foundUserMoviesLiked = foundUser.moviesLiked
      console.log('userMoviesLiked-->',userMoviesLiked)
      console.log('foundUserMoviesLiked-->',foundUserMoviesLiked)
      const filteredMovies = userMoviesLiked.filter((movie) => {
        console.log('movie -->', movie)
        console.log('foundUserMoviesLiked.includes(movie) -->', foundUserMoviesLiked.includes('6308a0f76ab8e9f5ff99e1ad'))
        console.log('foundUserMoviesLiked.includes(movie)',foundUserMoviesLiked.includes(movie))
        return foundUserMoviesLiked.includes(movie)
    })
    if (filteredMovies.length === 0){
      setError({message: 'Sadly, you have no films in common. Please keep swiping to find a match!' })
    } else {
    navigate(`/movies/${filteredMovies[Math.floor(Math.random() * filteredMovies.length)]}`)}
    } else {
      setError({ message: 'Please enter a valid username'})
    }
  }

  // ! JSX

return (
  <>
    { errorStatus === 401 ?
      <NeedToLogIn/>
    :
      <main className="movieMatch">
        <div className='match-container'>
          <h1> I am watching with...  </h1>
          <div className='form'>
            <form onSubmit={handleSubmit}>
                <input 
                  type='text'
                  name='username' 
                  value={watchWith.username}
                  placeholder='Username' 
                  onChange={handleFieldChange}>
                </input>
                <input type='submit' value="Submit" className='btn w-100'/>
            </form>
          </div>   
          <h2> {error && error.message} </h2>
        </div>
      </main>
    }  
  </>
)
}

export default Match