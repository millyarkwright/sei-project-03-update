import axios from 'axios'
import { Buffer } from 'buffer'
// might need to run npm i buffer -> buffer decodes an encoded string 

import { useNavigate } from 'react-router-dom'

// setting token

export const setToken = (token) => {
  window.localStorage.setItem('token', token)
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// getting token

export const getToken = () => {
  return window.localStorage.getItem('token')
}

// verify token by checking it exists and is JWT, aiming to return payload as object

export const getPayload = () => {
  const token = getToken()
  if (!token) return
  const splitToken = token.split('.')
  if (splitToken.length !==3) return
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}


export const getUserName = () => {
  const payload = getPayload()
  const { username } = payload
  return username
}

// check that expiry date is in the future

export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return
  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}

// unauthorised to view pages
export const UnauthorisedMessage = () => {
  return <h1>You are not authorised to view this page. Please login or create an account.</h1>
}
