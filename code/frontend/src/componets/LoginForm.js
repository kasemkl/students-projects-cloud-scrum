// LoginForm.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import '../styles/sign.css'
import AuthContext from '../context/AuthContext';





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
    <form onSubmit={handleLogin}>
        <fieldset>
        <h2>Login</h2>
        <div className="field">
        <label>
        University ID:
       </label>
        <input type="text" value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
        </div>

        <div className="field">
        <label>
        Password:
        </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      <button type="submit">Login</button>
      </fieldset>
    </form>
  );
};

export default LoginForm;
