import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import Dialog from '../componets/Dialog';

const AddUser = () => {
  const { registerUser, loginUser } = useContext(AuthContext);
  const api = useAxios();
  const [formData, setFormData] = useState({
    university_id: '',
    first_name: '',
    last_name: '',
    type: 'supervisor',
    password: '',
    confirmation_password: '',
    profile_photo: null,
  });
  const [dialogTitle, setDialogTitle] = useState();
  const [dialogText, setDialogText] = useState();
  const [res, setRes] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  };

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const isStrong=()=>{
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasDigit = /\d/.test(formData.password);
    return  formData.password.length > 7 && hasLetter && hasDigit;
  }

  const isMatch=()=>{
  return formData.password&&formData.confirmation_password&&formData.password===formData.confirmation_password
  }
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that required fields are not empty
    if (!formData.university_id || !formData.first_name || !formData.last_name || !formData.password) {
      console.log('All fields are required.');
      return;
    }

    try {
      // Wait for the registerUser promise to resolve
      const response = await api.post('/add-user/', formData);
      const data = response.data;

      if (response.status === 201) {
        console.log(data.message); // Log the success message
        setDialogTitle(data.title);
        setDialogText(data.text);
        setModalShow(true);
        setRes(response.status);
        // if(modalShow==false){
        // loginUser(formData);}
      }
} catch (error) {
        const data=error.response.data
        setDialogTitle(data.title);
        setDialogText(data.text);
        setModalShow(true);
    }
  };

  return (
    <>
      <Dialog
        title={dialogTitle}
        text={dialogText}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <div className='Form'>
        <form onSubmit={handleRegister} className="sign-up">
          <fieldset>
            <span className="title">Add User</span>
            
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
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder='Enter the password...'
                value={formData.password}
                onChange={handleInputChange}
              />
              <i className='bx bx-lock-alt'></i>
              <div className='show-hide' onClick={handleTogglePassword}>
                {showPassword ? <i class='bx bx-hide'></i> : <i class='bx bx-show' ></i>}
              </div>
            </div>
            {!isStrong()&&formData.password&&<p className="passwordError">password not strong enough</p>}

            <div className="field">
              <label>Confirmation Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmation_password"
                placeholder='Enter confirmation password...'
                value={formData.confirmation_password}
                onChange={handleInputChange}
              />
              <i className='bx bx-lock-alt'></i>
            </div>
            {!isMatch()&&formData.confirmation_password&&<p className="passwordError">confirmation password not match password</p>}

            <div className='.field'>
              <select
                id="projectType"
                className="form-select"
                value={formData.type}
                onChange={handleTypeChange}
              >
                <option value="manager">manager</option>
                <option value="supervisor">supervisor</option>
                <option value="employee">employee</option>
              </select>
            </div>

            <div className="field btn ">
              <button type="submit">Add User</button>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default AddUser;
