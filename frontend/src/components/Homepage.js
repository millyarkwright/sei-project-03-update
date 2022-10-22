// * Hooks 
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
// * Axios & API URL
import axios from 'axios'
import { API_URL } from "../config.js"
// * React Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Select from 'react-select'
import ListGroup from 'react-bootstrap/ListGroup'

const Homepage = () => {

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
  const [sort, setSort] = useState({
    az: false,
    za: false,
    best: false,
    worst: false,
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
      <div className="filter-container mt-3 p-3">
        <h1>Top 250 IMDb Movies</h1>
        <Row>
          <Col className='search-container col-12' md="6">
            <input type="text" className="search" placeholder="Search..." onChange={handleSearch} name="search" value={filters.search}></input>
          </Col>
          <Col className='sort-container col-12 my-3 my-md-0' md="6">
            <Select 
              options={sortOptions}
              onChange={handleSortChange}
              placeholder='sort by...'
            />
          </Col>
          <Col className='genre-container col-12 mt-md-3'>
            <div className='button-container'>
              {genres.map((item) => {
                return <button className={genreButton === item ? "btn-clicked" : ""} onClick={handleGenreFilter} name="genres" value={item} key={item}>{item}</button>
              })}
            </div>
          </Col>
        </Row>

      </div>
      <Row className="d-flex justify-content-between">
        { allMovies.length > 0
          ?
          filteredMovies.map(movie => {
            const { name, image_url, _id, rating } = movie
            return (
              <Col key={_id} className="mb-4 d-flex justify-content-center">
                <Link key={_id} to={`/movies/${_id}`}>
                  <Card>
                    <Card.Img variant="top" src={image_url}></Card.Img>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                      <Card.Title className="text-center mb-0">{name}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item className="text-center">IMDb Rating: ⭐️ {rating}</ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Link>
              </Col>
            )
          })
        :
        <>
          { error ? <h2>Something went wrong. Please try again later</h2> : <h2>'Loading...'</h2> }
        </>
        }
      </Row>
    </Container>
  )
}

export default Homepage