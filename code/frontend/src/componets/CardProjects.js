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
        <p className="card-text"><strong>Description:</strong> {description}</p>
        <p className="card-text"><strong>goal:</strong> {goal}</p>
        <p className="card-text"><strong>department:</strong> {department_id}</p>
        <p className="card-text"><strong>supervisor_id:</strong> {supervisor_id }</p>
        <p className="card-text"><strong>darte:</strong> {date}</p>
      </div>
    </div>
  );
};

export default CardProjects;