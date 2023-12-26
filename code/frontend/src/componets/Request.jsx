import '../styles/sign.css';
import React, { useState, useEffect, useContext } from 'react';
// Import the necessary hooks from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import '../styles/addSugg.css'
import Loading from '../componets/Loading'
import UserInfoContext from '../context/UserInfoContext';
import Dialog from './Dialog';
const RequestForm = () => {
    const navigate = useNavigate(); // Initialize the useHistory hook
    const api=useAxios()
    let {userInfo}=useContext(UserInfoContext)
    const [formData, setFormData] = useState({
      supervisor_id:userInfo.university_id,
      supervisor_name:userInfo.first_name + ' '+ userInfo.last_name,
      title: '',
      description: '',
      goal: '',
      department: '',
    });
    // console.log(formData)
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    goal: false,
    department: false,
  });
  const [departments, setDepartments] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalText, setModalText] = useState({
    title: 'Processing',
    text: 'please wait a second...'
  });
  useEffect(() => {
    // Fetch the list of departments
    const fetchData = async () => {
      try {
          const response = await api.get('/departments/');
          if (response.status === 200) {
              // console.log('departments', response.data);
              const rawData=response.data
      const dataArray = Object.keys(rawData).map(key => ({
        id: key,
        ...rawData[key],
      }));
        setDepartments(dataArray)
        console.log(departments)
          }
      } catch (error) {
          console.error('Error fetching requests:', error);
      }
  };
  fetchData();
  }, []);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };
  const handleBlur = (field) => {
    setTouchedFields((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const isValid = () => {
    // console.log(formData)
    return Object.keys(formData).every((field) => formData[field] !== '');
  };

  const handleSubmit = async(e) => {
    // Make a POST request to the Django API endpoint
    e.preventDefault(); // Prevent the default form submission behavior
    setModalShow(true)
    console.log(formData);
    try{
      let response=await api.post('/requests/',formData)
      setModalText({title:response.data.title,text:response.data.text})
      setModalShow(true)
      setFormData({
        ...formData,
        title: '',
        description: '',
        goal: '',
        department: '',
    })
  
  }
      catch (error) {
          // Handle errors
          console.error('Error updating request:', error);
      }
  };

  return (
    <div className='container request'>
      <Dialog
        title={modalText.title}
        text={modalText.text}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          navigate('/sugg-list');
          setModalText({
            title: 'Processing',
            text: 'please wait a second...'
          });
        }}
      />
    <div className={departments.length==0 ?'content-container':''}>
      {departments.length >0 ? (
        <form onSubmit={handleSubmit}>
        <fieldset>
          <div className='field'>
            <label>Title:</label>
            <input
            className='form-control'
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
            />
            {touchedFields.title && formData.title === '' && (
              <span className="FieldError">Title is required</span>
            )}
          </div>
  
          <div className='field'>
            <label>Description:</label>
            <textarea
            className='form-control'
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
            />
            {touchedFields.description && formData.description === '' && (
              <span className="FieldError">Description is required</span>
            )}
          </div>
  
          <div className='field'>
            <label>Goal:</label>
            <input
            className='form-control'
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              onBlur={() => handleBlur('goal')}
            />
            {touchedFields.goal && formData.goal === '' && (
              <span className="FieldError">Goal is required</span>
            )}
          </div>
  
          <div className='field'>
            <label>Department:</label>
            {departments.map((department) => (
              <div key={department.id}>
                <input
                  type="radio"
                  id={`department-${department.id}`}
                  name="department"
                  value={department.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('department')}
                />
                <label htmlFor={`department-${department.id}`}>{department.name}</label>
              </div>
            ))}
            {touchedFields.department && formData.department === '' && (
              <span className="FieldError">Department is required</span>
            )}
          </div>
  
          <div className='field'>
            <button type="submit" className='btn btn-primary' disabled={!isValid()}>
              Submit Request
            </button>
          </div>
        </fieldset>
      </form>)
          :
          (<Loading/>)
        }
        </div>
    </div>
  );
};

export default RequestForm;
