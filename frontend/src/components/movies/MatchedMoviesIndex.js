// * Hooks 
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom"

// * Axios & API URL
import axios from 'axios'
import { API_URL } from "../../config"
// * React Components
import Container from 'react-bootstrap/Container'

import MovieIndex from '../common/movieIndex'

const MatchedMovies = () => {

  const location = useLocation()

  // ! State
  const [allMovies, setAllMovies] = useState([])
  const [matchedMovieIds, setMatchedMovieIds] = useState([])
  const [matchedMovies, setMatchedMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

  // Save matched movies to state.
  
  useEffect(() => {
    console.log('location.state', location.state)
    setMatchedMovieIds(location.state)
  },[])

  // ! Request
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/movies`)
        // console.log('data', data)

        const sortData = data.sort((a,b) => a.name.localeCompare(b.name))

        // Filter data returning matched movies
        const matchedMovies = sortData.filter(movie => matchedMovieIds.includes(movie._id))

        // Get genres of matched movies so not every genre is displayed.
        const genres = [...new Set(matchedMovies.map(movie => movie.genre).flat().sort())]
        genres.unshift('All')

        const rating = [...new Set(matchedMovies.map(movie => movie.rating).flat().sort())]

        setMatchedMovies(matchedMovies)
        setGenres(genres)
      } catch (error) {
        setError(error)
        console.log('Movie Data Error', error)
      }
    }
    getData()
  },[matchedMovieIds])

  return (
    <Container as="main" className="homepage-wrapper">   
      <MovieIndex 
        genres={genres}
        movieData={matchedMovies}
        error={error}
        title="Matched Movies"
      />
    </Container>
  )
}

export default MatchedMovies