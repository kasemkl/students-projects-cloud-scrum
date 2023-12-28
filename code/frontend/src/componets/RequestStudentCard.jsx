import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import UserInfoContext from '../context/UserInfoContext';
import RenderContext from '../context/RenderContext';

const RequestStudentCard = ({ formData }) => {
  let { userInfo } = useContext(UserInfoContext);
  let {render,setRender}=useContext(RenderContext)
  let api = useAxios();
  const { id, supervisor_id, project_type,title,students, department, supervisor_name } = formData;

  
 


 

  return (
    <div className="card">
      <div className="card-body">
          <div>
            <h3 className="card-title">{title}</h3>
            <div className="card-content">
            <p className="card-text">
            <span>Students:</span>
            {Object.entries(students).map(([ID, student]) => (
                <span className='info' key={ID}> {student.name} </span>
              
            ))}
          </p>
          <p className="card-text">
              <span>Project type:</span> {project_type}
            </p>
              <p className="card-text">
                <span>department:</span> {department}
              </p>
              <p className="card-text">
                <span>supervisor:</span> {supervisor_name}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default RequestStudentCard;
