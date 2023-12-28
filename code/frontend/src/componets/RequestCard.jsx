import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import UserInfoContext from '../context/UserInfoContext';
import RenderContext from '../context/RenderContext';

const RequestCard = ({ formData }) => {
  let { userInfo } = useContext(UserInfoContext);
  let {render,setRender}=useContext(RenderContext)
  let api = useAxios();
  const { id, supervisor_id, title, description, goal, department, supervisor_name } = formData;

  // State to track edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State to store edited values
  const [editedData, setEditedData] = useState({
    id,
    title,
    description,
    goal,
    department,
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch the list of departments
    const fetchData = async () => {
      try {
        const response = await api.get('/departments/');
        if (response.status === 200) {
          const rawData = response.data;
          const dataArray = Object.keys(rawData).map((key) => ({
            id: key,
            ...rawData[key],
          }));
          setDepartments(dataArray);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      try {
        let response = await api.post(`/delete-requests/`,{'id':formData.id});
        console.log(response.data);
        console.log('Item deleted!');
        setRender(!render);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    console.log('edittttt',editedData)
    try {
      let response = await api.put(`/myrequests/`, editedData);
      console.log(response.data);
      console.log('Item updated!');
      setIsEditing(false);
      setRender(!render)
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset the edited data to the original values
    setEditedData({
      title,
      description,
      goal,
      department: formData.department,
    });
  };
  return (
    <div className="card">
      <div className="card-body">
        {isEditing ? (
          <div className='edit-request'>
            <label htmlFor="title">Title:</label>
            <input
  className='form-control'
              type="text"
              id="title"
              name="title"
              value={editedData.title}
              onChange={handleInputChange}
            />
            <label htmlFor="description">Description:</label>
            <input
            className='form-control'
              type="text"
              id="description"
              name="description"
              value={editedData.description}
              onChange={handleInputChange}
            />
            <label htmlFor="goal">Goal:</label>
            <input
            className='form-control'
              type="text"
              id="goal"
              name="goal"
              value={editedData.goal}
              onChange={handleInputChange}
            />
            <div>
              {departments.map((dept) => (
                <div key={dept.id}>
                  <input
                    type="radio"
                    id={dept.id}
                    name="department"
                    value={dept.name}
                    checked={editedData.department === dept.name}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={dept.id}>{dept.name}</label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
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
                <span>supervisor:</span> {supervisor_name}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="buttons">
        {userInfo.type === 'student' && !isEditing && (
          <Link to="#" className="btn button">
            Apply
          </Link>
        )}
        {userInfo.university_id === supervisor_id && (
          <div>
            {isEditing ? (
                <>
                <button className='btn btn-primary' onClick={handleUpdateClick}>Update</button>
            <button className='btn btn-secondary' onClick={handleCancelClick}>Cancel</button>
                </>
    ) : (
                <>
              <button className='btn btn-primary' onClick={handleEditClick}>Edit</button>
            <button  onClick={handleDeleteClick} className="btn btn-danger">
              Delete
            </button>
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
