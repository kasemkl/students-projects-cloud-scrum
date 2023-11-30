import '../styles/sign.css';
import React, { useState, useEffect, useContext } from 'react';
// Import the necessary hooks from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import '../styles/addSugg.css'
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
    department: '1',
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch the list of departments
    const fetchData = async () => {
      try {
          const response = await api.get('/departments/');
          if (response.status === 200) {
              console.log('departments', response.data);
              setDepartments(response.data);
          }
      } catch (error) {
          console.error('Error fetching requests:', error);
      }
  };
  fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'department') {
      setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
        department: '1',
    })}
      catch (error) {
          // Handle errors
          console.error('Error updating request:', error);
      }
  };

  return (
    <div className='request'>

    <form onSubmit={handleSubmit}>
      <fieldset>
        <div className='field'>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className='field'>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className='field'>
          <label>Goal:</label>
          <input type="text" name="goal" value={formData.goal} onChange={handleChange} />
        </div>
        <div className='field'>
          <label>Department:</label>
          {departments.map(department => (
            <div key={department.id}>
              <input
                type="radio"
                id={`department-${department.id}`}
                name="department"
                value={department.id}
                defaultChecked={department.id === 1} 
                onChange={handleChange}
                />
              <label htmlFor={`department-${department.id}`}>{department.name}</label>
            </div>
          ))}
        </div>
        <div className='field'>
          <button type="submit">Submit Request</button>
        </div>
      </fieldset>
    </form>
    </div>
  );
};

export default RequestForm;
