import React, { useContext ,useState,useEffect} from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink
} from 'mdb-react-ui-kit';
import UserInfoContext from '../context/UserInfoContext';
import useAxios from '../utils/useAxios';
import Dialog from './Dialog';
import ConfirmDialog from './ConfirmDialog';
import RenderContext from '../context/RenderContext';


const EmployeeCard = ({ formData }) => {
  const { id,title, description, goal, department,date,supervisor_name ,students,project_type} = formData;
  const {userInfo}=useContext(UserInfoContext)
  const api=useAxios()
  const {render,setRender}=useContext(RenderContext)
  const [modalConfirmShow, setModalConfirmShow] = useState(false);
  const [modalShow,setModalShow]=useState(false)
  const [modalText, setModalText] = useState({
  title: 'Processing',
  text: 'please wait a second...'
});

const handleResponse = async (response) => {
    setModalShow(true);
    try {
      let res = await api.post(`/employee/`, {
        response: response,
        id:id
      });
      setModalText({ title: res.data.title, text: res.data.text });
      setModalShow(true);
      setRender(!render)
      console.log(res.data);
    } catch (error) {
      console.log('Error during fetching data', error);
    }
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
          handleResponse('failed');
          setRender(!render);
          setModalConfirmShow(false);
        }}
        />
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
        <div className="buttons">
              <button className="btn btn-success" onClick={() => handleResponse('success')}>
                Accept
              </button>
              <button className="btn btn-danger" onClick={() => setModalConfirmShow(true)}>
                Delete
              </button>
            </div>
        </div>
      </div>
    </div>
              </>
  );
};

export default EmployeeCard;