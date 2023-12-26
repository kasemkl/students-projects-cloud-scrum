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
  const { title, description, goal, department,date,supervisor_name ,students,project_type} = formData;
  return (
    <div className="card" >
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className='card-content'>
        <p className="card-text"><span>Description:</span> {description}</p>
        <p className="card-text"><span>Goal:</span> {goal}</p>
        <p className="card-text"><span>Department:</span> {department}</p>
        <p className="card-text"><span>Supervisor:</span> {supervisor_name }</p>
        <p className="card-text">
            <span>Students:</span>
            {Object.entries(students).map(([ID, student]) => (
                <span className='info'> {student.name} </span>
              
            ))}
          </p>
          <p className="card-text">
              <span>Project type:</span> {project_type}
            </p>
        <p className="card-text"><span>Date:</span> {date}</p>
        </div>
      </div>
    </div>
  );
};

export default CardProjects;