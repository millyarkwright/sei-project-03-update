import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from "../../config.js"
import axios from 'axios'
import Select from 'react-select'

import NeedToLogIn from '../helpers/redirect.js'
import { randomMovie } from '../helpers/movieFunctions'
import { shuffle } from '../helpers/movieFunctions'


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

  const [matchedMovieIds, setMatchedMovieIds] = useState([])

// * Get Current User Data
  useEffect(() => {
    const getCurrentUserData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/profile`)
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
        // console.log('username options', usernameOptions)
        setUsernameOptions(usernameOptions)
      } catch (error) {
        setError(setError)
        setErrorStatus(error.response.status)
      }
    }
    getUsernames()
  }, [])

  
  // * Calling the findCommonMovies function when watchWith state updates
  useEffect(() => {
    findCommonMovies()
  }, [watchWith])
  
  const getChosenUserPreferences = async (username) => {
    try {
      const {data} = await axios.get((`${API_URL}/preferences/${username}`))
      // console.log('chosenUserPreferences data', data)
      return data.moviesLiked 
    } catch (error) {
      setError(error)
      setErrorStatus(error.response.status)
    }
  }

  const findCommonMovies = async () => {
    // console.log('watchwith', watchWith)
    if ('usernames' in watchWith) {
      const chosenUserLikes = await Promise.all(watchWith.usernames.map(async result => {
        const chosenUserPreferences = await getChosenUserPreferences(result)
        return chosenUserPreferences
      }))
      // Combining the likes of chosen users with those of the current user (an array of arrays):
      const usersLikesArray = chosenUserLikes.concat([userData.moviesLiked])
      console.log('usersLikesArray', usersLikesArray)
      // One array of movieIds: any movieId that any of the chosen users + current user have liked. 
      const everyLikedMovieId = [...new Set(usersLikesArray.flat())]
      console.log('everyLikedMovieId', everyLikedMovieId)

      // MoviesIds that every chosen user (inc current user) has liked. 
      // let commonLikes = []

    //   for (let i = usersLikesArray[0].length - 1; i >= 0; i--) {
    //     for (let j = usersLikesArray.length - 1; j > 0; j--) {
    //       // console.log('J--->,', j)
    //       if (usersLikesArray[j].indexOf(usersLikesArray[0][i]) == -1) {
    //           break;
    //         }
    //       if (j >= 1) {
    //           console.log('J--->,', j)
    //           commonLikes.push(usersLikesArray[0][i]);
    //       }
    //       }
    // }

    console.log("TESTING", usersLikesArray.slice(1))
    let commonLikes = usersLikesArray.slice(1).reduce((result, currentArray) => {
      return currentArray.filter(function(currentItem) {
          return result.indexOf(currentItem) !== -1;
      });
  }, usersLikesArray[0]);

      console.log('COMMON LIKES',commonLikes)
      // setMatchedMovieIds(commonLikes)
      // return uniqueMovieIds
    }
  } 

  // ! Executions


  const handleUsernameChange = (event) => {
    // the event here is the selectedUsernames, returning an array of objects (label and value of chosen users)
    const selectedUsernames = event.map((item) => { return item.label })
    const selectedUserIds = event.map((item) => { return item.value })
    setSelectedUsernames([...event])
    setWatchWith({ ...watchWith, 'usernames': selectedUsernames, 'ids': selectedUserIds })
  }



  const handleSubmit = (event) => {
    event.preventDefault()
    // console.log('handle submit event', event)
    if ('usernames' in watchWith && watchWith.usernames.length > 0) {
      const buttonClicked = event.nativeEvent.submitter.name
      if (buttonClicked === "randomMovie") {
        navigate(`/movies/${randomMovie(matchedMovieIds)}`, {state: { matchedMovieIds: matchedMovieIds, watchWith: watchWith }})
      } else if (buttonClicked === "movieIndex") {
        navigate(`/matchedmovies`, {state: { matchedMovieIds: matchedMovieIds, watchWith: watchWith }})
      } 
    } else {
        setError({message: 'Please select a user'})
    }
}

// useEffect(() => {
//   shuffle(matchedMovies)
// },[matchedMovies])

// ! JSX

return (
  <>
    { errorStatus === 401 ?
      <NeedToLogIn/>
      :
      <main className="movieMatch">
        <div className="match-container mx-5">
          <h1 className="mb-4"> I am watching with...</h1>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
                <Select
                  value={selectedUsernames}
                  name="usernames"
                  options={usernameOptions}
                  className="basic-multi-select mb-4 px-2"
                  classNamePrefix="select"
                  isMulti
                  onChange={handleUsernameChange} />
                <div className="matchButtons">
                  <input type='submit' value="Give me a random matched movie" name="randomMovie" className="btn mx-2 mb-4 py-3"/>
                  <input type='submit' value="Take me to all our matched movies" name="movieIndex" className="btn mx-2 mb-4 py-3"/>
                </div>
            </form>
          </div>   
          <h3> {error && error.message} </h3>
        </div>
      </main>
    }  
  </>
)
}

export default Match

