// Import Hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../config.js"

// Import React Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

// Import Axios
import axios from "axios"

// Import Helpers
import { setToken } from '../helpers/auth'

const Login = () => {

  // Navigation
  const navigate = useNavigate()

  // State
  const [userData, setUserData] = useState({
    username:'', 
    password:''
  })
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFieldChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  // Execution
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const { data } = await axios.post(`${API_URL}/login`, userData)
      const { token } = data
      setToken(token)
      navigate("/swipe")
    } catch (error) {
      setIsError(true)
      setErrorMessage(error.response.data.message)
    }
  }

  return (
    <main className='formPage'>
      <Container>
        <Row className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input type="text" name="username" placeholder="Your username" value={userData.username} onChange={handleFieldChange}/>
          <input type="password" name="password" placeholder="Your password" value={userData.password} onChange={handleFieldChange} />
          <input type="submit" value="Login" className='btn w-100'/>
          {isError && <h4>{errorMessage}</h4>}
        </form>
        </Row>
      </Container>
    </main>
  )

}

export default Login