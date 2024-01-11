import React, { useContext, useState } from 'react'
import useAxios from '../utils/useAxios';
import Dialog from './Dialog';
import RenderContext from './../context/RenderContext';
import UserInfoContext from '../context/UserInfoContext';

const AdvertsCard = ({formData}) => {
    let {id,title,url}=formData
    let api=useAxios()
    const {userInfo}=useContext(UserInfoContext)
    const {render,setRender}=useContext(RenderContext)
    const [modalShow, setModalShow] = React.useState(false);
    const [modalText, setModalText] = useState({
      title: 'Processing',
      text: 'please wait a second...'
    });



    function getFileNameFromURL(url) {
    const urlObject = new URL(url);
    const pathname = decodeURIComponent(urlObject.pathname);
    const fileName = pathname.split('/').pop();
    return fileName;
}
    const fileName=getFileNameFromURL(url);

    const getFilePathFromURL = (url) => {
      try {
        const urlObject = new URL(url);
        const filePath = decodeURIComponent(urlObject.pathname);
        return filePath;
      } catch (error) {
        console.error('Error extracting file path:', error);
        return null;
      }
    };
  
    const filePath = getFilePathFromURL(url);
    const handleDelete=async()=>{
      setModalShow(true)
    try{
      let response=await api.post('/delete-advert/',{'id':id,'file_name':fileName})
      setModalText({title:response.data.title,text:response.data.text})
      setModalShow(true)
    }
    catch(error){
      console.log(error)
    }
    }
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
            title: 'Processing',
            text: 'please wait a second...'
          });
        }}
      />
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          <div className="card-content">
            <p className="card-text">
              <span>File:</span>  <a
        href={url}
        download="Example-PDF-document"
      >

        <button className='form-control'><i className='bx bxs-file-doc' ></i> {fileName}</button>
      </a>
            </p>
            </div>
            </div>
            {userInfo.groups.includes('committee')&&
            <button className='btn btn-danger' onClick={handleDelete}>delete</button>}
            </div>
    </div>
  )
}

export default AdvertsCard
