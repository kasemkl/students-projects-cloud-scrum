import React, { useContext, useState } from 'react';
import useAxios from '../utils/useAxios';
import Dialog from './Dialog';
import { useNavigate } from 'react-router-dom';
import RenderContext from '../context/RenderContext';

const AddAdverts = () => {
  const [file, setFile] = useState(null);
  const [file_url, setFile_Url] = useState(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate(); // Initialize the useHistory hook
  const [touchedFields, setTouchedFields] = useState({
    title: false,
  });
  const api = useAxios();
  const [modalShow, setModalShow] = React.useState(false);
  const [modalText, setModalText] = useState({
    title: 'Processing',
    text: 'please wait a second...'
  });

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBlur = (field) => {
    setTouchedFields((prevTouched) => ({ ...prevTouched, [field]: true }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) {
      console.log('File and title are required.');
      return;
    }
  setModalShow(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      let response = await api.post('/advert/', formData);
      console.log('File uploaded successfully. File URL:', response.data.file_url);
      setModalText({title:response.data.title,text:response.data.text})
      setModalShow(true)      
      setModalShow(true)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='container request'>
      <Dialog
        title={modalText.title}
        text={modalText.text}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          navigate('/');
          setModalText({
            title: 'Processing',
            text: 'please wait a second...'
          });
        }}
      />
      <form onSubmit={handleUpload}>
        <fieldset>
        <h2>Add Advertsiment</h2>
          <div className='field'>
            <label>Title:</label>
            <input
              className='form-control'
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
            />
            {touchedFields.title && title === '' && (
              <span className="FieldError">Title is required</span>
            )}
          </div>
          <input type="file" onChange={handleFileChange} className='form-control'/>
          <button type="submit" className='btn btn-primary'>Upload File</button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddAdverts;
