// Myrequests.js
import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../utils/useAxios';
import RequestCard from '../componets/RequestCard';
import RenderContext from '../context/RenderContext';
import Loading from '../componets/Loading';
import UserInfoContext from '../context/UserInfoContext';
import RequestStudentCard from '../componets/RequestStudentCard';

const Myrequests = () => {
  const api = useAxios();
  const [data, setData] = useState([]);
  const { render } = useContext(RenderContext);
  const [isEmpty,setIsEmpty]=useState()
  const {userInfo}=useContext(UserInfoContext)
  const [studentRequests,setStudentRequests]=useState({})

  const fetchData = async () => {
    try {
      const response = await api.get(`/myrequests/`);
      const jsonData = response.data;
      const rawData = response.data;
      const dataArray = Object.keys(rawData).map((key) => ({
        id: key,
        ...rawData[key],
      }));
      setData(dataArray);
      // console.log(dataArray)
      if(dataArray.length===0)
      setIsEmpty(true)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStudentData = async () => {
    try {
      let response = await api.get('/myrequest-student/');
      // console.log(response.data);
      setStudentRequests(response.data);
        if(Object.keys(response.data).length===0)
        setIsEmpty(true)
    } catch (error) {
      console.log('Error during fetch:', error);
    }
  };

  useEffect(() => {
    console.log(userInfo)
    userInfo.type==='student' ?
     fetchStudentData():userInfo.type?fetchData():''
    
  }, [render,userInfo]);
  return (
    <div className="container">
      <h1>My Requests</h1>
      { userInfo.type==='student'? (
        Object.keys(studentRequests).length > 0 ? (
          <div className="projects-list">
            {Object.entries(studentRequests).map(([id, request]) => (
              <RequestStudentCard key={id} formData={request} />
            ))}
          </div>
        ) : isEmpty ? (
          <p>no requests</p>
        ) : (
          <div className="content-container">
            <Loading />
          </div>
        )
      ) :
      (data.length>0? (
      <div className="projects-list">
        {data.map((request) => (
          <RequestCard key={request.id} formData={request} />
        ))}
      </div>):isEmpty? <p>no requests</p>:
      <div className='content-container'>
        <Loading/>
      </div>)

      
      
      }
    </div>
  );
};

export default Myrequests;
