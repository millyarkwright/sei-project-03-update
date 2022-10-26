// Import React Hooks & Axios
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

// Import React Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { API_URL } from '../../config'

// Import Helpers
import { userIsAuthenticated } from '../helpers/auth'

const MovieInfo = () => {

  const { movieId } = useParams()
  const [movie, setMovie] = useState()
  const [error, setError] = useState('')


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/movies/${movieId}`)
        setMovie(data)
      } catch (error) {
        setError(error)
      }
    }
    getData()
  }, [movieId])

  return (
      <Container className="movieInfo-wrapper">
      {movie ?
        <>
        <Row className="movieInfo-container">
          <Col className="movieInfoImage">
            <Link to={`/swipe`}>  
              <img src={movie.image_url} alt="Movie Poster"></img>
            </Link>
          </Col>
          <Col md="8">
            <div className="movieDetails" >
              <header className="movieInfo">
                <h1>{movie.name}</h1>
                <div className="imdbRating">
                  <p>IMDb RATING</p>
                  <p>⭐️ {movie.rating}</p>
                </div>
              </header>
              <div className="genre-container">
                {movie.genre.map(genre => {
                return (
                  <div className="genre" key={genre}>{genre}</div>
                )
                })}
              </div>
              <p className="lead">{movie.desc}</p>
              <div className ="actors-and-directors-container">
                <h4>Stars</h4>
                  <div className="actors-container">
                    {movie.actors.map(actor => {
                    return (
                      <p className="actors" key={actor}>{actor}</p>
                    )
                    })}
                  </div>
                  { movie.directors.length > 1 ? <h4>Directors</h4> : <h4>Director</h4>}
                  <div className="directors-container">
                    {movie.directors.map(director => {
                    return (
                      <p className="directors" key={director}>{director}</p>
                    )
                    })}
                  </div>
              </div>
                <div className="button-style-div">
                  {userIsAuthenticated() ? 
                    <Link to={`/swipe`}>  
                        <button className="back-button">Back To Swipe</button>
                    </Link>
                  :
                    <Link to={`/`}>  
                      <button className="back-button">Back To Movies</button>
                    </Link>
                  }
                    <button className="imdbLink"><a href={`https://www.imdb.com${movie.imdb_url}`}target="_blank" rel="noreferrer">Take me to IMDb</a></button>
                </div>

            </div>

          </Col>
        </Row>
        </>
        :
        <h2 className="errorMessage">
          {error ? 'Something went wrong. Please try again later.' : 'Loading...'}
        </h2>
        }
      </Container>
  )
}

export default MovieInfo


