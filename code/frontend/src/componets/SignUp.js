// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/sign.css'



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

const SignUp = ({ onLogin }) => {
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
console.log({ university_id: universityId, password: password })
client.post(
    "/register/",
    {
      university_id: universityId,
      password: password
    }
  )
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  };

  return (
    <form onSubmit={handleLogin}>
        
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
    </form>
  );
};

export default SignUp;
