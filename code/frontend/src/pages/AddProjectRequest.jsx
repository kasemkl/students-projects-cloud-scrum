import '../styles/sign.css';
import React, { useState, useEffect, useContext } from 'react';
// Import the necessary hooks from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import '../styles/addSugg.css'
import Loading from '../componets/Loading'
import UserInfoContext from '../context/UserInfoContext';
import Dialog from '../componets/Dialog';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardSubTitle,
    MDBCardText,
    MDBCardLink,
    MDBBtn,
    MDBInput,
    MDBRange
  } from 'mdb-react-ui-kit';


  
  const AddProjectRequest = () => {
    const navigate = useNavigate(); // Initialize the useHistory hook
    const api=useAxios()
    let {userInfo}=useContext(UserInfoContext)
    const [departments, setDepartments] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(1);
    const [students, setStudents] = useState([userInfo.university_id]);
    const [project_type,setProject_type]=useState('junior')
    const [modalShow, setModalShow] = React.useState(false);
    const [modalText, setModalText] = useState({
      title: 'Processing',
      text: 'please wait a second...'
    });
    const [formData, setFormData] = useState({
      supervisor_id:'',
      title: '',
      description: '',
      goal: '',
      department: '',
      project_type:project_type,
      students:students
    });
    // console.log(formData)
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    goal: false,
    department: false,
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

    const fetchSupervisorsData = async () => {
      try {
          const response = await api.get('/supervisors/');
          if (response.status === 200) {
              console.log('departments', response.data);
        setSupervisors(response.data)
        console.log(supervisors)
          }
      } catch (error) {
          console.error('Error fetching requests:', error);
      }
  };
  fetchSupervisorsData();
  fetchData();
  }, []);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };
  const handleBlur = (field) => {
    setTouchedFields((prevTouched) => ({ ...prevTouched, [field]: true }));
  };
  const handleNumberOfStudentsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfStudents(value);
  };

  const handleStudentIdChange = (e, index) => {
    const newStudents = [...students];
    newStudents[index] = parseInt(e.target.value, 10);
    setStudents(newStudents);
    setFormData({...formData,students:newStudents})
  };
  const handleProjectTypeChange = (e) => {
    setProject_type(e.target.value);
  };
  const handleSelectSupervisor=(e)=>{
    console.log(e.target.value)
    setFormData({...formData,supervisor_id:parseInt(e.target.value,10)})
  }

  const isValid = () => {
    // console.log(formData)
    return Object.keys(formData).every((field) => formData[field] !== '');
  };

  const handleSubmit = async(e) => {
    // Make a POST request to the Django API endpoint
    e.preventDefault(); // Prevent the default form submission behavior
    setModalShow(true)
    console.log('formmm',formData);
    try{
      let response=await api.post('/add-project/',formData)
      console.log(response.data)
      setModalText({title:response.data.title,text:response.data.text})
      setModalShow(true)
      setFormData({
        supervisor_id:'',
        title: '',
        description: '',
        goal: '',
        department: '',
        project_type:project_type,
        students:students
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
          <div>
            <MDBRange
              label="Number of Students"
              defaultValue={1}
              min="1"
              max="4"
              step="1"
              id="customRange"
              value={numberOfStudents}
              onChange={handleNumberOfStudentsChange}
            />
            {Array.from({ length: numberOfStudents }).map((_, index) => (
              <MDBInput
                key={index}
                className="form-control "
                type="text"
                placeholder={`Student ${index + 1} ID`}
                value={students[index]} // Access student ID directly from the array
                disabled={index === 0}
                onChange={(e) => handleStudentIdChange(e, index)}
              />
            ))}
             <div>
        <label htmlFor="projectType">Select Project Type:</label>
        <select
          id="projectType"
          className="form-select "
          value={project_type}
          onChange={handleProjectTypeChange}
        >
          <option value="junior">مشروع فصلي</option>
          <option value="graduation1">مشروع تخرج 1</option>
          <option value="graduation2">مشروع تخرج 2</option>
        </select>
        <label htmlFor="supervisor">Select a supervisor:</label>
        <select
                id="supervisor"
                className="form-select "
                value={formData.supervisor_id}
                onChange={handleSelectSupervisor}
                >
                <option value="" disabled>Select a Supervisor</option>
                {supervisors.map(supervisor => (
                    <option key={supervisor.university_id} value={supervisor.university_id}>
                    Dr. {supervisor.first_name} {supervisor.last_name}
                    </option>
                ))}
                </select>
      </div>
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

export default AddProjectRequest;
