import React from 'react'
import CardProjects from '../componets/CardProjects';
import { useState,useEffect,useContext } from 'react';
import RenderContext from '../context/RenderContext';
import UserInfoContext from '../context/UserInfoContext';
import useAxios from '../utils/useAxios';
import Loading from '../componets/Loading';


const MyProject = () => {
    const api = useAxios();
    const [data, setData] = useState([]);
    const { render } = useContext(RenderContext);
    const [isEmpty,setIsEmpty]=useState()
    const {userInfo}=useContext(UserInfoContext)
  
    const fetchData = async () => {
      try {
        const response = await api.get(`/myprojects/`);
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
  
    useEffect(() => {
    fetchData();
      
    }, [render,userInfo]);
    return (
      <div className="container">
        <h1>My Projects</h1>
     
        {data.length>0? (
        <div className="projects-list">
          {data.map((project) => (
            <CardProjects key={project.id} formData={project} />
          ))}
        </div>):isEmpty? <p>No Projects</p>:
        <div className='content-container'>
          <Loading/>
        </div>}
      </div>
    );
  };
    

export default MyProject
