// Import Link & Navigate
import { Link, useNavigate } from 'react-router-dom'

// Import React Bootstrap Components
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

// Import Helpers
import { userIsAuthenticated } from './helpers/auth'

const PageNavBar = () => {

  // Router Variables
const navigate = useNavigate()

const handleLogout = () => {
  window.localStorage.removeItem('token')
  navigate('/login')
}
  return (
    <Navbar expand='md'>
      <Container as='section'>
        { userIsAuthenticated() ?
          <Navbar.Brand as={Link} to='/match'>🍿 Watch<span>it</span> 🍿</Navbar.Brand> 
          :
          <Navbar.Brand as={Link} to='/'>🍿 Watch<span>it</span> 🍿</Navbar.Brand> 
        }
        <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
        <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
          { userIsAuthenticated()
          ?
          <>
            <Nav.Link as={Link} to='/swipe'>Swipe</Nav.Link>
            <Nav.Link as={Link} to='/match'>Match</Nav.Link>
            <Nav.Link as={Link} to='/profile'>Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
          :
          <>
            <Nav.Link as={Link} to='/login'>Login</Nav.Link>
            <Nav.Link as={Link} to='/register'>Register</Nav.Link>
          </>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default PageNavBar