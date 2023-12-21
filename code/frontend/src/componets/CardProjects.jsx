import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink
} from 'mdb-react-ui-kit';


const CardProjects = ({ formData }) => {
  const { title, description, goal, department_id,date,supervisor_id } = formData;
  return (
    <div className="card" >
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className='card-content'>
        <p className="card-text"><span>Description:</span> {description}</p>
        <p className="card-text"><span>Goal:</span> {goal}</p>
        <p className="card-text"><span>Department:</span> {department_id}</p>
        <p className="card-text"><span>Supervisor_id:</span> {supervisor_id }</p>
        <p className="card-text"><span>Date:</span> {date}</p>
        </div>
      </div>
    </div>
  );
};

export default CardProjects;