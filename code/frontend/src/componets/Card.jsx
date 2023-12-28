import React, { useContext, useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import UserInfoContext from '../context/UserInfoContext';
import Dialog from './Dialog';
import ConfirmDialog from './ConfirmDialog';
import RenderContext from '../context/RenderContext';

const Card = ({ formData, isApplied }) => {
  const { user } = useContext(AuthContext);
  const { userInfo } = useContext(UserInfoContext);
  const api = useAxios();
  const {render,setRender}=useContext(RenderContext)
  const { id, supervisor_id, title, description, goal, department, supervisor_name } = formData;
  const [showFields, setShowFields] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [numberOfStudents, setNumberOfStudents] = useState(1);
  const [students, setStudents] = useState([user.university_id]);
  const [modalConfirmShow, setModalConfirmShow] = useState(false);
  const [projectKey, setProjectKey] = useState(); // Assuming there's only one key
  const [projectId, setProjectId] = useState();
  const [modalText, setModalText] = useState({
    title: 'Checking Info',
    text: 'please wait a second...'
  });
  const [project_type,setProject_type]=useState('junior')
  
  // const handleDeleteClick = async () => {
  //   // Display a confirmation dialog
  //   const isConfirmed = window.confirm('Are you sure you want to delete this item?');
  //   if (isConfirmed) {
  //     try {
  //       // Perform the delete action here using async/await
  //       let response = await api.delete(`/sugg-projects/${id}/`);

  //       // Log the response after the delete operation
  //       console.log(response.data);

  //       // Log a message indicating that the item is deleted
  //       console.log('Item deleted!');
  //     } catch (error) {
  //       // Handle errors if the delete operation fails
  //       console.error('Error deleting item:', error);
  //     }
  //   }
  // };
  const handleNumberOfStudentsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfStudents(value);
  };

  const handleStudentIdChange = (e, index) => {
    const newStudents = [...students];
    newStudents[index] = parseInt(e.target.value, 10);
    setStudents(newStudents);
  };
  const handleProjectTypeChange = (e) => {
    setProject_type(e.target.value);
  };
  
  const handleSubmit = async () => {
    // Perform submit logic here, using the 'students' array
    // ...
    setShowFields(false);
    const formData = {
      project_id: id,
      title: title,
      supervisor_name:supervisor_name,
      department:department,
      supervisor_id: supervisor_id,
      students: students, // IDs only
      project_type:project_type 
    };

    setModalShow(true);
    try {
      const response = await api.post(`/apply-project/`, formData);

      setModalText({ title: response.data.title, text: response.data.text });
      setModalShow(true);
      console.log(response.data);
      console.log('Application submitted!');
    } catch (error) {
      console.error('Error applying to the project:', error);
    }

    // Reset the form state after submission
    setNumberOfStudents(1);
    setStudents([user.university_id]); // Reset students array when the number of students changes
  };

  const handleCancel = () => {
    setShowFields(false);
    setNumberOfStudents(1);
    setStudents([user.university_id]); // Reset students array when the number of students changes
  };

  const handleCancelRequest = () => {
    console.log('result trueee');
  };

  return (
    <>
      <Dialog
        title={modalText.title}
        text={modalText.text}
        show={modalShow}
        onHide={() => {
          setRender(!render);
          setModalShow(false);
          setModalText({
            title: 'Checking Info',
            text: 'please wait a second...'
          });
        }}
      />

      <ConfirmDialog
        show={modalConfirmShow}
        onHide={() => {
          setModalConfirmShow(false)
          ;
        }}
        onConfirm={() => {
          handleCancelRequest();
          setModalConfirmShow(false);
        }}
      />

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="card-content">
            <p className="card-text">
              <span>Description:</span> {description}
            </p>
            <p className="card-text">
              <span>goal:</span> {goal}
            </p>
            <p className="card-text">
              <span>department:</span> {department}
            </p>
            <p className="card-text">
              <span>supervisor:</span> {supervisor_name}
            </p>
          </div>
        </div>
        <div className="buttons apply-btn">
          {!showFields && userInfo.type === 'student' && !isApplied && (
            <button
              className="btn btn-success"
              onClick={() => {
                setShowFields(true);
              }}
            >
              Apply
            </button>
          )}
          {isApplied && (
            <button disabled className="btn btn-secondary">
              You applied to the project
            </button>
          )}
       
        </div>
        {showFields && (
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
                className="form-control input-card"
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
          className="form-select input-card"
          value={project_type}
          onChange={handleProjectTypeChange}
        >
          <option value="junior">مشروع فصلي</option>
          <option value="graduation1">مشروع تخرج 1</option>
          <option value="graduation2">مشروع تخرج 2</option>
        </select>
      </div>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit Application
            </button>
            <button className="btn btn-primary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
