// LoginForm.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import '../styles/login.css'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';




const LoginForm = () => {
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  let {loginUser}=useContext(AuthContext)
  const handleLogin = async (e) => {
    e.preventDefault();
  const formData={
    university_id:universityId,
    password:password
  }
  loginUser(formData)
  
};

  return (
    <form onSubmit={handleLogin} className='login'>
    <fieldset>
      <span className='title'>Log in</span>
      <div className="field">
        <label>
          University ID <sup></sup>
        </label>
        <input
          type="text"
          placeholder="Type your university id..."
          name="university_id"
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
        />
        <i className='bx bxs-id-card'></i>
      </div>
      <div className="field">
        <label>Password </label>
        <input
          type="password"
          placeholder="Type your password name..."
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <i className='bx bx-lock-alt'></i>
      </div>
      <div className="field">
        <button type="submit">Login</button>
      </div>
    <div class="login-signup">
                    <span class="text">Not a member? 
                        <Link to="/sign-up" class="text login-link"> Sign Up Now</Link>
                    </span>
                </div>
    </fieldset>
  </form>
  );
};

export default LoginForm;
