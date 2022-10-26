// * Hooks 
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
// * Axios & API URL
import axios from 'axios'
import { API_URL } from "../../config"
// * React Components
import Container from 'react-bootstrap/Container'

import MovieIndex from '../common/movieIndex'

const MatchedMovies = () => {

  // ! State
  // Data
  const [allMovies, setAllMovies] = useState([])
  // Filters
  const [genres, setGenres] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [filters, setFilters] = useState({
    genres: 'All',
    search: '',
    sort: '',
  })

  const [genreButton, setGenreButton] = useState('All')

  // Errors
  const [error, setError] = useState('')

  const sortOptions = [
    { value: 'az', label: 'A-Z'},
    { value: 'za', label: 'Z-A'},
    { value: 'highest', label: 'Highest Rating'},
    { value: 'lowest', label: 'Lowest Rating'},
  ]

  // ! Request
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/movies`)
        console.log('data', data)

        const movies = data.sort((a,b) => a.name.localeCompare(b.name))
        console.log('movies->', movies)

        // Map through data to get movie genres, flatten to remove the arrays within the array (so just one array). Sort genres alphabetically. Set to remove duplicates.
        const genres = [...new Set(data.map(movie => movie.genre).flat().sort())]
        genres.unshift('All')
        // console.log('genres', genres)

        const rating = [...new Set(data.map(movie => movie.rating).flat().sort())]
        // console.log('rating', rating)

        setAllMovies(movies)
        setGenres(genres)
      } catch (error) {
        setError(error)
        console.log('Movie Data Error', error)
      }
    }
    getData()
  },[])

  // ! Execution

  const handleSearch = (event) => {
    console.log('FILTERS', filters)
    const newObj = {
      ...filters,
      [event.target.name]: event.target.value
    }
    setFilters(newObj)
  }

  const handleGenreFilter = (event) => {
    console.log('FILTERS', filters)
    const newObj = {
      ...filters,
      [event.target.name]: event.target.value
    }
    console.log('FILTERS post', newObj)
    setFilters(newObj)
    setGenreButton(event.target.value)
  }

  const handleSortChange = (event) => {
    console.log('SORT event->', event)
    const newObj = {
      ...filters,
      sort: event.value
    }
    setFilters(newObj)
  }

  const sortMovies = (movieData) => {
    console.log('movieData', movieData)
    console.log('filters.sort', filters.sort)
    if(filters.sort === 'az') {
      return movieData.sort((a,b) => a.name.localeCompare(b.name))
    } else if (filters.sort === 'za') {
      return movieData.sort((a,b) => b.name.localeCompare(a.name))
    } else if (filters.sort === 'highest') {
      return movieData.sort((a,b) => b.rating - a.rating)
    } else if (filters.sort === 'lowest') {
      return movieData.sort((a,b) => a.rating - b.rating)
    } else {
      return movieData
    }
  }

  // ! Filter/Sort Movies
    useEffect(() => {
      const regexSearch = new RegExp(filters.search, 'gi')
      // console.log('saved genre', filters.genres)
      // console.log('search value', regexSearch)
      const filteredArray = allMovies.filter(movie => {
        return regexSearch.test(movie.name) && (movie.genre.includes(filters.genres) || filters.genres === 'All')
      })
      // console.log('filtered array', filteredArray)

      const sortedArray = sortMovies(filteredArray)

      // console.log('sorted array', sortedArray)

      setFilteredMovies(sortedArray)
  
    }, [allMovies, filters])

  return (
    <Container as="main" className="homepage-wrapper">   
      <MovieIndex 
        filters={filters}
        handleSearch={handleSearch}
        sortOptions={sortOptions}
        handleSortChange={handleSortChange}
        genres={genres}
        genrebutton={genreButton}
        handleGenreFilter={handleGenreFilter}
        movieData={allMovies}
        filteredMovies={filteredMovies}
        error={error}
      />
    </Container>
  )
}

export default MatchedMovies