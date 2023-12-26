// Myrequests.js
import React, { useState, useEffect, useContext } from 'react';
import useAxios from '../utils/useAxios';
import RequestCard from '../componets/RequestCard';
import RenderContext from '../context/RenderContext';
import Loading from '../componets/Loading';

const Myrequests = () => {
  const api = useAxios();
  const [data, setData] = useState([]);
  const { render } = useContext(RenderContext);
  const [isEmpty,setIsEmpty]=useState()

  const fetchData = async () => {
    try {
      const response = await api.get('/myrequests/');
      const jsonData = response.data;
      const rawData = response.data;
      const dataArray = Object.keys(rawData).map((key) => ({
        id: key,
        ...rawData[key],
      }));
      setData(dataArray);
      console.log(dataArray)
      if(dataArray.length===0)
      setIsEmpty(true)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [render]);
  return (
    <div className="container">
      <h1>My Requests</h1>
      {data.length>0? (
      <div className="projects-list">
        {data.map((request) => (
          <RequestCard key={request.id} formData={request} />
        ))}
      </div>):isEmpty? <p>no requests</p>:
      <div className='content-container'>
        <Loading/>
      </div>}
    </div>
  );
};

export default Myrequests;
