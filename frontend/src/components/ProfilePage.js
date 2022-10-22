import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config.js"

// Import React Bootstrap Components 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// Import Helpers
import NeedToLogIn from './helpers/redirect.js'
// import { UnauthorisedMessage } from "./helpers/auth.js"

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState([])
  const [userPasswords, setUserPasswords] = useState({
    password: '',
    newPassword: '',
    newConfirmPassword: ''
  })
  const [error, setError] = useState()
  const [errorStatus, setErrorStatus] = useState()

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/profile`)
        setUserInfo(data)
      } catch (error) {
        setError(error)
        setErrorStatus(error.response.status)
      }
    }
    getUserInfo()
  }, [])

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/movies`)
      } catch (error) {
        setError(error)
      }
    }
    getMovieData()
  }, [])
  
  const handleChange = (event) => {
    const newObj = { ...userPasswords, [event.target.name]: event.target.value }
    setUserPasswords(newObj)
  }
  
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.put(`${API_URL}/profile`, userPasswords)
    } catch (error) {
      setError(error)
      setErrorStatus(error.response.status)
    }
  }

  return (
    <>
      { errorStatus === 401 ? 
        <NeedToLogIn/>
      :
      <Container className="profile-wrapper">
        <Row>
          <h1>Profile</h1>
        </Row>
        <Row className="userDetails">
          <Row>
            <Col sm="6">
              <h3  className="fw-bold">Username</h3>
            </Col>
            <Col sm="6">
              <h3>{userInfo.username}</h3>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <h3  className="fw-bold">Email Address</h3>
            </Col>
            <Col sm="6">
              <h3>{userInfo.email}</h3>
            </Col>
          </Row>
        </Row>
        <Row className='changePassword-container'>
          <h3>Change Password</h3>
          <form onSubmit={handleFormSubmit} className="change-password-fields">
              <input type="password" name="password" placeholder="Your current password" onChange={handleChange} />
              <input type="password" name="newPassword" placeholder="Your new password" onChange={handleChange} />
              <input type="password" name="newConfirmPassword" placeholder="Confirm new password" onChange={handleChange}/>
              <input type="submit" value="Change Password"/>
              { error && <p>{error.message}</p>}
          </form>
        </Row>
      </Container>
      }
      </>
    )
}
export default ProfilePage