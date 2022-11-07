// * Hooks 
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
// * Axios & API URL
import axios from 'axios'
import { API_URL } from "../config.js"
// * React Components
import Container from 'react-bootstrap/Container'

import MovieIndex from './common/movieIndex'

const Homepage = () => {

  // ! State
  // Data
  const [allMovies, setAllMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

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

  return (
    <Container as="main" className="homepage-wrapper">   
      <MovieIndex 
        genres={genres}
        movieData={allMovies}
        error={error}
        title="Top 250 IMDb Movies"
      />
    </Container>
  )
}

export default Homepage


// <div className="filter-container mt-3 p-3">
// <h1>Top 250 IMDb Movies</h1>
// <Row>
//   <Col className='search-container col-12' md="6">
//     <input type="text" className="search" placeholder="Search..." onChange={handleSearch} name="search" value={filters.search}></input>
//   </Col>
//   <Col className='sort-container col-12 my-3 my-md-0' md="6">
//     <Select 
//       options={sortOptions}
//       onChange={handleSortChange}
//       placeholder='sort by...'
//     />
//   </Col>
//   <Col className='genre-container col-12 mt-md-3'>
//     <div className='button-container'>
//       {genres.map((item) => {
//         return <button className={genreButton === item ? "btn-clicked" : ""} onClick={handleGenreFilter} name="genres" value={item} key={item}>{item}</button>
//       })}
//     </div>
//   </Col>
// </Row>

// </div>
// <Row className="d-flex justify-content-between">
// { allMovies.length > 0
//   ?
//   filteredMovies.map(movie => {
//     const { name, image_url, _id, rating } = movie
//     return (
//       <Col key={_id} className="mb-4 d-flex justify-content-center">
//         <Link key={_id} to={`/movies/${_id}`}>
//           <Card>
//             <Card.Img variant="top" src={image_url}></Card.Img>
//             <Card.Body className="d-flex justify-content-center align-items-center">
//               <Card.Title className="text-center mb-0">{name}</Card.Title>
//             </Card.Body>
//             <ListGroup className="list-group-flush">
//               <ListGroup.Item className="text-center">IMDb Rating: ⭐️ {rating}</ListGroup.Item>
//             </ListGroup>
//           </Card>
//         </Link>
//       </Col>
//     )
//   })
// :
// <>
//   { error ? <h2>Something went wrong. Please try again later</h2> : <h2>'Loading...'</h2> }
// </>
// }
// </Row>