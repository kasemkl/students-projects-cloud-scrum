import React, { useContext } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink
} from 'mdb-react-ui-kit';
import UserInfoContext from '../context/UserInfoContext';


const CardProjects = ({ formData }) => {
  const { title, description, goal, department,date,supervisor_name ,students,project_type} = formData;
  const {userInfo}=useContext(UserInfoContext)

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
              userInfo.type==="employee"?
                <p className='info'> ID :{ID} , Name :{student.name} </p>:
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