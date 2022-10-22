// unauthorised to view pages
import { useNavigate } from 'react-router-dom'
import {useEffect} from 'react'

const NeedToLogIn = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/login')
  },[])
  return <h1>Loading</h1>
}

export default NeedToLogIn