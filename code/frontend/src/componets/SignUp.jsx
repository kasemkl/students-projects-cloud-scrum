// LoginForm.js
import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
const defaultPhotoUrl = '../images/default_profile_photo.jpg';

const SignUp = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    university_id: '',
    first_name: '',
    last_name: '',
    password: '',// Corrected property name
    profile_photo: null,  
  });
  const [imageSrc, setImageSrc] = useState();
 

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const updatedFormData = { ...formData, [name]: files ? files[0] : value };
    setFormData(updatedFormData);
  };
  const handleImageChange = (event) => {
    const fileInput = event.target;
  
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      setFormData({...formData,profile_photo:fileInput.files[0]})
      reader.onload = function (e) {
      setImageSrc(e.target.result);
      };
  
      reader.readAsDataURL(fileInput.files[0]);
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
  
    // Validate that required fields are not empty
    if (!formData.university_id || !formData.first_name || !formData.last_name || !formData.password) {
      console.log('All fields are required.');
    }
  
    // Continue with the registration process
    registerUser(formData);
  };
  
  return (
    <form onSubmit={handleRegister} className="sign-up">
      <fieldset>
        <span className="title">Sign Up</span>
        
        <div className="avatar avatar-xl">
                    <img src={imageSrc? imageSrc:require('../images/default_profile_photo.jpg')} alt="..." className="avatar-img rounded-circle" />
                    <div className="change-photo">
                        <label className="" for="customFile">Change Photo</label>
                        <input type="file" className="form-control d-none" id="customFile" onChange={handleImageChange} />
                    </div>
                  </div>
        <div className="field">
          <label>University ID:</label>
          <input
            type="text"
            name="university_id"
            placeholder='Enter your university id...'
            value={formData.university_id}
            onChange={handleInputChange}
          />
          <i className='bx bxs-id-card'></i>
        </div>

        <div className="field">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            placeholder='Enter you first name...'
            value={formData.first_name}
            onChange={handleInputChange}
          />
          <i className='bx bxs-user-detail'></i>
        </div>

        <div className="field">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            placeholder='Enter your last name...'
            value={formData.last_name}
            onChange={handleInputChange}
          />
          <i className='bx bxs-user-detail'></i>
        </div>


          <div className="field">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder='Enter the password...'
              value={formData.password}
              onChange={handleInputChange}
            />
            <i className='bx bx-lock-alt'></i>
          </div>

          <div className="field">
            <label>Confirmation Password:</label>
            <input
              type="password"
              name="password"
              placeholder='Enter confirmation password...'
              value={formData.password}
              onChange={handleInputChange}
            />
            <i className='bx bx-lock-alt'></i>
          </div>
       

        <div className="field">
          <button type="submit">Sign up</button>
        </div>
        <div class="login-signup">
          <span class="text">
            Already a member?
            <Link to="/login" class="text login-link">
              {" "}
              Login Now
            </Link>
          </span>
        </div>
      </fieldset>
    </form>
  );
};

export default SignUp;
