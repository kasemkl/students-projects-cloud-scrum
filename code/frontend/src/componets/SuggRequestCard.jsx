import React, { useContext,useState } from 'react'
import UserInfoContext from '../context/UserInfoContext'
import Dialog from './Dialog';
import ConfirmDialog from './ConfirmDialog';
import RenderContext from './../context/RenderContext';
import useAxios from '../utils/useAxios';

const SuggRequestCard = ({request}) => {

    // console.log(request)
    const { title, description, goal, department, supervisor_name } = request;
    const {userInfo}=useContext(UserInfoContext)
    const {render,setRender}=useContext(RenderContext)
    const name=userInfo.first_name+' '+userInfo.last_name
    const [modalConfirmShow, setModalConfirmShow] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    let api=useAxios()
     const [modalText, setModalText] = useState({
       title: 'Processing',
       text: 'please wait a second...'
     });

     const handleDecision = async (requestId, decision,name) => {
        setModalShow(true)
        try{
        let response=await api.patch('/manager-requests-list/',{
            id:requestId,
            status:decision,
            user_name:name
        })
        // console.log(response.data)
        setModalText({title:response.data.title,text:response.data.text})
        setModalShow(true)
        }
        catch (error) {
            // Handle errors
            console.error('Error updating request:', error);
        }
        
    };

  return (
    <div>
            <Dialog
          title={modalText.title}
          text={modalText.text}
          show={modalShow}
          onHide={() => {
            setRender(!render)
            setModalShow(false);
            setModalText({
              title: "Processing",
              text: "please wait a second...",
            });
          }}
        />
        <ConfirmDialog
          show={modalConfirmShow}
          onHide={() => {
            setModalConfirmShow(false);
          }}
          onConfirm={() => {
            handleDecision(request.id, "rejected", name);
            setModalConfirmShow(false);
          }}
        />
      <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">{title}</h3>
                    <p className="card-text">
                      <strong>Description:</strong> {description}
                    </p>
                    <p className="card-text">
                      <strong>goal:</strong> {goal}
                    </p>
                    <p className="card-text">
                      <strong>department:</strong> {department}
                    </p>
                    <p className="card-text">
                      <strong>supervisor:</strong> Dr.{supervisor_name}
                    </p>
                  </div>
                  <div className="">
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleDecision(request.id, "accepted", name)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setModalConfirmShow(true)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default SuggRequestCard
