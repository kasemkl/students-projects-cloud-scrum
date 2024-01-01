import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import UserInfoContext from '../context/UserInfoContext';
import Dialog from './Dialog';
import ConfirmDialog from './ConfirmDialog';
import RenderContext from '../context/RenderContext';

const StudentProjectRequestCard = ({ request_id, project ,url}) => {
  
  const { project_id, students, supervisor_name, title ,project_type,description,department,goal} = project;
    const api=useAxios()
    const {userInfo}=useContext(UserInfoContext)
    const [userStatus,setUserStatus]=useState()
    const [modalConfirmShow, setModalConfirmShow] = useState(false);
    const [modalShow,setModalShow]=useState(false)
    const [modalText, setModalText] = useState({
    title: 'Processing',
    text: 'please wait a second...'
  });
    const {render,setRender}=useContext(RenderContext)

  const handleResponse = async (response) => {
    setModalShow(true);
    try {
      let res = await api.post(`${url}`, {
        response: response,
        request_id: request_id,
      });
      setModalText({ title: res.data.title, text: res.data.text });
      setModalShow(true);
      console.log(res.data);
    } catch (error) {
      console.log('Error during fetching data', error);
    }
  };

useEffect(()=>{
    if(userInfo.type==='student'){
   setUserStatus( students[userInfo.university_id]['status']);}
   console.log(userStatus)
},[])

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
            title: 'Processing',
            text: 'please wait a second...'
          });
        }}
      />

      <ConfirmDialog
        show={modalConfirmShow}
        onHide={() => {
          setModalConfirmShow(false);
        }}
        onConfirm={() => {
          handleResponse('delete');
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
            <span>Students:</span>
            {Object.entries(students).map(([ID, student]) => (
              <p key={ID}>
                <span className='info'>ID: {ID}, name: {student.name},</span>
                {!userInfo.groups.includes("supervisor")? 
                <span className='status'>Status: <span className={`${student.status}`}>{student.status}</span></span>:''}
                {userInfo.groups.includes("supervisor")? 
                <span className='status'>GPA: <span>{student.GPA}</span></span>:''}
              </p>
            ))}
          </p>
          {!userInfo.groups.includes("supervisor") && (
            <p className="card-text">
              <span>Supervisor:</span> Dr.{supervisor_name}
            </p>
          )}
          <p className="card-text">
              <span>Project type:</span> {project_type}
            </p>
          {(userInfo.groups.includes("student") && userStatus === 'pending'|| userInfo.groups.includes("supervisor"))  && (
            <div className="buttons">
              <button className="btn btn-success" onClick={() => handleResponse('accept')}>
                Accept
              </button>
              <button className="btn btn-danger" onClick={() => setModalConfirmShow(true)}>
                Delete
              </button>
            </div>
          )}
          {(userInfo.type === 'student' && userStatus === 'sender') && (
            <div className="buttons">
              <button className="btn btn-danger" onClick={() => handleResponse('delete')}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
          </>
  );
          }
export default StudentProjectRequestCard;
