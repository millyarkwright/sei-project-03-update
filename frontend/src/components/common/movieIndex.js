import { Link } from "react-router-dom"
// * React Components
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Select from 'react-select'
import ListGroup from 'react-bootstrap/ListGroup'

const MovieIndex = ({ filters, handleSearch, sortOptions, handleSortChange, genres, genreButton, handleGenreFilter, movieData, filteredMovies, error}) => {

  return (
    <>
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
        { movieData.length > 0
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
    </>
  )
}

export default MovieIndex