import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import LoginForm from '../componets/LoginForm'
import '../styles/loginPage.css'
const LoginPage = () => {
  let {loginUser}=useContext(AuthContext)
  return (
    <div className='login-page'>
      <LoginForm/>
    </div>
  )
}

export default LoginPage
