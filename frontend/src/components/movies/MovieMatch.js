import {useState, useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { API_URL } from "../../config.js"
import axios from 'axios'
import Select from 'react-select'

import NeedToLogIn from '../helpers/redirect.js'

const Match = () => {

  const navigate = useNavigate()

  // ! State
  const [userData, setUserData] = useState()
  const [watchWith, setWatchWith] = useState([])
  const [error, setError] = useState()
  const [errorStatus, setErrorStatus] = useState()

  // * For Select
  const [usernameOptions, setUsernameOptions] = useState([])
  const [selectedUsernames, setSelectedUsernames] = useState()

  const [matchedMovies, setMatchedMovies] = useState([])

  useEffect(() => {
    const getCurrentUserData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/profile`)
        // console.log('CURRENT USER DATA', data.moviesLiked)
        // setAllMoviesLiked(data.moviesLiked)
        setUserData(data)
      } catch (error) {
        setError(error)
        setErrorStatus(error.response.status)
      }
    }
    getCurrentUserData()
  }, [])

  // * Get usernames for React Select
  useEffect(() => {
    const getUsernames = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/usernames`)
        let usernameOptions = data.map(user => ({ value: user._id, label: user.username }))
        // console.log('username options?', usernameOptions)
        setUsernameOptions(usernameOptions)
      } catch (error) {
        setError(setError)
        setErrorStatus(error.response.status)
      }
    }
    getUsernames()
  }, [])

  useEffect(() => {
    console.log('-------matched movies-------')
    console.log(matchedMovies)
  }, [matchedMovies])
  

  useEffect(() => {
    // if('usernames' in watchWith){
      // console.log('USERNAMES EXIST')
      findCommonMovies()
    // }
  }, [watchWith])

  // ! Executions


  const handleUsernameChange = (event) => {
    // the event here is the selectedUsernames, returning an array of objects (label and value of chosen users)
    const selectedUsernames = event.map((item) => { return item.label })
    const selectedUserIds = event.map((item) => { return item.value })
    setSelectedUsernames([...event])
    setWatchWith({ ...watchWith, 'usernames': selectedUsernames, 'ids': selectedUserIds })
  }


  const getChosenUserPreferences = async (username) => {
    try {
      const {data} = await axios.get((`${API_URL}/preferences/${username}`))
      console.log('chosenUserPreferences data', data)
      return data.moviesLiked 
    } catch (error) {
      setError(setError)
      setErrorStatus(error.response.status)
    }
  }

  const findCommonMovies = async () => {
    console.log('watchwith', watchWith)
    if ('usernames' in watchWith) {
      const chosenUserLikes = await Promise.all(watchWith.usernames.map(async result => {
        console.log('RESULT', result)
        const chosenUserPreferences = await getChosenUserPreferences(result)
        return chosenUserPreferences
      }))
      // Combining the likes of chosen users with those of the current user (an array of arrays):
      const allLikes = chosenUserLikes.concat([userData.moviesLiked])
      console.log('allLikes', allLikes)
      const uniqueMovieIds = [...new Set(allLikes.flat())]
      console.log('uniqueMovieIds', uniqueMovieIds)
      setMatchedMovies(uniqueMovieIds)
      // return uniqueMovieIds
    }
  } 

  const handleSubmit = (event) => {
    event.preventDefault()

    navigate(`/movies/${matchedMovies[Math.floor(Math.random() * matchedMovies.length)]}`)
  
}



  const handleSubmitOld = (event) => {
    event.preventDefault()
    // ERROR TEST
    // const foundUser = allUsersAndTheirLikes.find(user => watchWith.username === user.username)
    // if (foundUser) {
    //   const userMoviesLiked = userData.moviesLiked
    //   const foundUserMoviesLiked = foundUser.moviesLiked
    //   console.log('userMoviesLiked-->',userMoviesLiked)
    //   console.log('foundUserMoviesLiked-->',foundUserMoviesLiked)
    //   const filteredMovies = userMoviesLiked.filter((movie) => {
    //     console.log('movie -->', movie)
    //     console.log('foundUserMoviesLiked.includes(movie) -->', foundUserMoviesLiked.includes('6308a0f76ab8e9f5ff99e1ad'))
    //     console.log('foundUserMoviesLiked.includes(movie)',foundUserMoviesLiked.includes(movie))
    //     return foundUserMoviesLiked.includes(movie)
    //   })
    //     if (filteredMovies.length === 0){
    //     setError({message: 'Sadly, you have no films in common. Please keep swiping to find a match!' })
    //   } else {
    //     setMatchedMovies(filteredMovies)
    //     // navigate(`/movies/matchedmovies` )

    //     // navigate(`/movies/${filteredMovies[Math.floor(Math.random() * filteredMovies.length)]}`)
    //   }
    // } else {
    //   setError({ message: 'Please enter a valid username'})
    // }
  }

  // ! JSX

return (
  <>
    { errorStatus === 401 ?
      <NeedToLogIn/>
    :
      <main className="movieMatch">
        <div className='match-container'>
          <h1> I am watching with...  </h1>
          <div className='form'>
            <form onSubmit={handleSubmit}>
              {/* <label htmlFor="users">users</label> */}
                <Select
                  value={selectedUsernames}
                  name="usernames"
                  options={usernameOptions}
                  className="basic-multi-select mb-3"
                  classNamePrefix="select"
                  isMulti
                  onChange={handleUsernameChange} >
                </Select>
                <input type='submit' value="Submit" className='btn w-100'/>
            </form>
          </div>   
          <h2> {error && error.message} </h2>
        </div>
      </main>
    }  
  </>
)
}

export default Match