// MyComponent.jsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/projectslist.css';
import axios from 'axios';
import CardProjects from './CardProjects';
import useAxios from '../utils/useAxios';
import Loading from './Loading';

const ProjectsList = () => {
  const [data, setData] = useState([]);
  let api=useAxios()
  const fetchData = async () => {
    let response =await api.get('/projects/')
    if(response.status === 200){
      console.log('projects',response.data)
      const rawData=response.data
      const dataArray = Object.keys(rawData).map(key => ({
        id: key,
        ...rawData[key],
      }));
        setData(dataArray)
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1>Projects List:</h1>
      <div className={data.length==0 ?'content-container':''}>
      {data.length >0 ? (
        <div className='projects-list'>
        {data.map((suggProject) => (
          <CardProjects key={suggProject.id} formData={suggProject} />
          ))}
          </div>)
          :
          (<Loading/>)
        }
      </div>
    </div>
  );
};

export default ProjectsList;
