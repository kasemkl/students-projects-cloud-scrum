// LoginForm.js
import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
const defaultPhotoUrl = '../images/default_profile_photo.jpg';
const SignUp = ({ onLogin }) => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    university_id: '',
    first_name: '',
    last_name: '',
    password: '',// Corrected property name
    profile_photo: null,  
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const updatedFormData = { ...formData, [name]: files ? files[0] : value };
    setFormData(updatedFormData);
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
    <form onSubmit={handleRegister}>
      <div className="field">
        <label>University ID:</label>
        <input type="text" name="university_id" value={formData.university_id} onChange={handleInputChange} />
      </div>

      <div className="field">
        <label>First Name:</label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
      </div>

      <div className="field">
        <label>Last Name:</label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
      </div>

      <div className="field">
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
      </div>

      <div className="field">
        <label>Profile Photo:</label>
        {formData.profile_photo ? (
          <img
            src={URL.createObjectURL(formData.profile_photo)}
            alt="Profile Preview"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
        ) : (
         <p>no photo selected</p>
        )}
        <input type="file" name="profile_photo" onChange={handleInputChange} Value={'../../../backend/media/images/default_profile_photo.jpg'}/>
      </div>



      <button type="submit">Sign up</button>
    </form>
  );
};

export default SignUp;
