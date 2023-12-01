import '../styles/sign.css';
import React, { useState, useEffect, useContext } from 'react';
// Import the necessary hooks from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import '../styles/addSugg.css'
import Loading from '../componets/Loading'
const RequestForm = () => {
    const navigate = useNavigate(); // Initialize the useHistory hook
    const api=useAxios()
    let {user}=useContext(AuthContext)
  const [formData, setFormData] = useState({
    supervisor_id:user.user_id,
    supervisor_name:user.first_name,
    title: '',
    description: '',
    goal: '',
    department: '',
  });
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    goal: false,
    department: false,
  });
  const [departments, setDepartments] = useState([]);

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
    return Object.keys(formData).every((field) => formData[field] !== '');
  };
  const handleSubmit = async(e) => {
    // Make a POST request to the Django API endpoint
    e.preventDefault(); // Prevent the default form submission behavior

    console.log(formData);
    try{
      let response=await api.post('/requests/',formData)
      console.log(response.data)
      setFormData({
        supervisor_id:user.user_id,
        supervisor_name:user.first_name,
        title: '',
        description: '',
        goal: '',
        department: '',
    })
  alert('request is send ')
  navigate('/sugg-list')
  }
      catch (error) {
          // Handle errors
          console.error('Error updating request:', error);
      }
  };

  return (
    <div className='container request'>
    <div className={departments.length==0 ?'content-container':''}>
      {departments.length >0 ? (
        <form onSubmit={handleSubmit}>
        <fieldset>
          <div className='field'>
            <label>Title:</label>
            <input
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
