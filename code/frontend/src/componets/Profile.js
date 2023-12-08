import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import { useState } from 'react'
import UserInfoContext from '../context/UserInfoContext'

const Profile = () => {
    const {user}=useContext(AuthContext)
    const api=useAxios()
    const [formData, setFormData] = useState({
      email:'',
      old_password: '',
      new_password: '',
      confirmation_password: '',
      profile_photo: null,  
    });
    const [imageSrc, setImageSrc] = useState([]);
    const {userImage,updateUserInfo}=useContext(UserInfoContext)

    useEffect(() => {
      // Set the imageSrc inside useEffect to ensure userImage is available
      setImageSrc(userImage);
    }, [userImage]);
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const updatedFormData = { ...formData, [name]: value };
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
    const handleSubmit= async(e)=>{
      e.preventDefault(); // Prevent the default form submission behavior
        updateUserInfo(formData)
      }
    
    return (
    <div>
      <form onSubmit={handleSubmit}>
              <div className="row mt-5 align-items-center">
                <div className="col-md-3 text-center mb-5">
                  <div className="avatar avatar-xl">
                    <img src={imageSrc} alt="..." className="avatar-img rounded-circle" />
                    <div className="change-photo">
                        <label className="" for="customFile">Change Photo</label>
                        <input type="file" className="form-control d-none" id="customFile" onChange={handleImageChange} />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="row align-items-center">
                    <div className="col-md-7">
                      <h4 className="mb-1">{user.first_name} {user.last_name}</h4>
                      <p className="small mb-3"><span className="badge badge-dark">New York, USA</span></p>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-7">
                      <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit nisl ullamcorper, rutrum metus in, congue lectus. In hac habitasse platea dictumst. Cras urna quam, malesuada vitae risus at,
                        pretium blandit sapien.
                      </p>
                    </div>
                    <div className="col">
                      <p className="small mb-0 text-muted">Nec Urna Suscipit Ltd</p>
                      <p className="small mb-0 text-muted">P.O. Box 464, 5975 Eget Avenue</p>
                      <p className="small mb-0 text-muted">(537) 315-1481</p>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="firstname">University ID</label>
                  <input type="text" id="firstname" className="form-control" placeholder={user.university_id} readOnly/>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="firstname">Firstname</label>
                  <input type="text" id="firstname" className="form-control" placeholder={user.first_name} readOnly/>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="lastname">Lastname</label>
                  <input type="text" id="lastname" className="form-control" placeholder={user.last_name} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputEmail4">Email</label>
                <input type="email" className="form-control" id="inputEmail4" placeholder={user.email} name='email' onChange={handleInputChange}/>
              </div>
              <hr className="my-4" />
              <div className="row mb-4">
                <div className="col-md-6">
                  <form>
                    <div className="form-group">
                      <label htmlFor="inputPassword4">Old Password</label>
                      <input type="password" className="form-control" id="inputPassword5" 
                      name='old_password'value={formData.old_password} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputPassword5">New Password</label>
                      <input type="password" className="form-control" id="inputPassword5" 
                      name='new_password' value={formData.new_password} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputPassword6">Confirm Password</label>
                      <input type="password" className="form-control" id="inputPassword6" 
                      name='confirmation_password' value={formData.confirmation_password} onChange={handleInputChange}/>
                    </div>
                  </form>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">Password requirements</p>
                  <p className="small text-muted mb-2">To create a new password, you have to meet all of the following requirements:</p>
                  <ul className="small text-muted pl-4 mb-0">
                    <li>Minimum 8 characters</li>
                    <li>At least one special character</li>
                    <li>At least one number</li>
                    <li>Can’t be the same as a previous password</li>
                  </ul>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Change</button>
            </form>
    </div>
  )
}

export default Profile
