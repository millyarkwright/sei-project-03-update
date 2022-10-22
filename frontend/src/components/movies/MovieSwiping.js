import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import axios from "axios"
import { API_URL } from "../../config.js"
import { getUserName } from "../helpers/auth"
// Import React Bootstrap Components 
import Container from 'react-bootstrap/Container'
// Import Helpers
import NeedToLogIn from '../helpers/redirect.js'
// import { UnauthorisedMessage } from "./helpers/auth.js"

const MovieSwiping = () => {
  const [count, setCount] = useState(0)
  const [userData, setUserData] = useState([])
  const [moviesRemaining, setMoviesRemaining] = useState()
  const [allMovies, setAllMovies] = useState('')
  const [error, setError] = useState('')
  const [errorStatus, setErrorStatus] = useState()
 
  // ! Get all movie data & movie Ids
  useEffect(() => {
    const pullMovies = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/movies`)
        console.log('data', data)
        const filteredData = data.filter(movie => {
          // const movieAlreadyLiked = userData.moviesLiked.map(likedMovie => likedMovie).includes(movie._id)
          const movieAlreadyLiked = userData.moviesLiked.includes(movie._id)
          // const movieAlreadyDisliked = userData.moviesDisliked.map(dislikedMovie => dislikedMovie).includes(movie._id)
          const movieAlreadyDisliked = userData.moviesDisliked.includes(movie._id)
          return !(movieAlreadyLiked || movieAlreadyDisliked)
        })
        setAllMovies(filteredData)
      } catch (error) {
        setError(error)
      }
    }
    pullMovies()
  },[userData])

  // If user has been through all movies
  useEffect(() => {
    const moviesRemaining = allMovies.length
    setMoviesRemaining(moviesRemaining)
  },[allMovies])

  // ! Get User Data
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
  
  // ! Handle Button Click & Update DB
  const handleButtonClick = (event) => {
    if(event.target.name === "likes") {
      const updateLikes = async () => {
        try {
          const { data } = await axios.put(`${API_URL}/preferences/likes/${allMovies[count]._id}`)
        } catch (error) {
          setError(error)
          setErrorStatus(error.response.status)
        }
      }
        updateLikes()
      } else {  
        const updateDislikes = async () => {
          try {
            const { data } = await axios.put(`${API_URL}/preferences/dislikes/${allMovies[count]._id}`)
          } catch (error) {
            setError(error)
            setErrorStatus(error.response.status)
          }
        }
        updateDislikes()
      }
      setCount(count + 1)
    }

  return (
    <Container className="movieSwiping-wrapper">
    {  errorStatus === 401 ? 
        <NeedToLogIn/>
      :
      allMovies ?
        moviesRemaining === 0 ? 
          <h2>You've been through all the movies! Please wait for an update.</h2> 
        :
        <> 
          <div className='movieSwipe-container'>
            <div className="movie-name">
              <h2 id="movies-name">{allMovies[count].name}</h2>
            </div>
            <div className="min-display-container">
              <div className="preference-container">
                <div className="preferenceButtons">
                  <button name="dislikes" value="no" id="no" onClick={handleButtonClick} >✕</button>
                </div>
                <div className='movieImage'> 
                  <Link to={`/movies/${allMovies[count]._id}`}>  
                    <img src={allMovies[count].image_url} alt="Movie Poster"></img> 
                  </Link>
                </div>
                <div className="preferenceButtons">
                  <button name="likes" value="yes" id="yes" onClick={handleButtonClick} >✔</button>
                </div>
              </div>
              <div className="min-display-button">
                <Link to={`/movies/${allMovies[count]._id}`}>  
                  <button> click for more information</button>
                </Link>
              </div>
            </div>
          </div>
        </>
      :
      <>
        {<h2>Loading</h2>}
      </>
    }
  </Container>
  )
}

export default MovieSwiping