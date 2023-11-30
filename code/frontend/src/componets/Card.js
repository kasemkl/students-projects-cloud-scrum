import React, { useContext } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink
} from 'mdb-react-ui-kit';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import useAxios from './../utils/useAxios';

const Card = ({ formData }) => {
  let {user}=useContext(AuthContext)
  let api=useAxios()
  const {id,supervisor_id, title, description, goal, department ,supervisor_name} = formData;
  const handleDeleteClick = async() => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      try {
        // Perform the delete action here using async/await
        let response = await api.delete(`/sugg-projects/${id}/`);
        
        // Log the response after the delete operation
        console.log(response.data);
        
        // Log a message indicating that the item is deleted
        console.log('Item deleted!');
        window.location.reload()
      } catch (error) {
        // Handle errors if the delete operation fails
        console.error('Error deleting item:', error);
      }
    }
  };
  return (
    <div className="card" >
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text"><strong>Description:</strong> {description}</p>
        <p className="card-text"><strong>goal:</strong> {goal}</p>
        <p className="card-text"><strong>department:</strong> {department}</p>
        <p className="card-text"><strong>supervisor:</strong> {supervisor_name}</p>
      </div>
      <div className='buttons'>
        {user.groups.includes('student') && <Link to="#" className="btn btn-success">Apply</Link>}
        {user.user_id === supervisor_id && <Link to="#" onClick={handleDeleteClick}className="btn btn-danger">Delete</Link>}
      </div>
    </div>
  );
};

export default Card;