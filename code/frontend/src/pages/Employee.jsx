import React, { useContext } from 'react'
import  { useEffect, useState } from "react";
import RenderContext from '../context/RenderContext';
import useAxios from '../utils/useAxios';
import CardProjects from '../componets/CardProjects';
import Loading from '../componets/Loading';
import EmployeeCard from '../componets/EmployeeCard';

const Employee = () => {
    const [data, setData] = useState([]);
    const {render}=useContext(RenderContext)
    const [isEmpty,setIsEmpty]=useState()
    const api=useAxios()

    useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await api.get("/employee/");
        
            if (response.status === 200) {
        
              // Check if response.data is an empty object
              console.log(response.data)
              const isEmptyObject = Object.keys(response.data).length === 0;
        
              if (isEmptyObject) {
                setIsEmpty(true);
              } else {
                const rawData = response.data;
                const dataArray = Object.keys(rawData).map((key) => ({
                  id: key,
                  ...rawData[key],
                }));
                setData(dataArray);
                setIsEmpty(false);
              }
            }
          } catch (error) {
            // Handle errors
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, [render]);
  return (
    <div className='container'>
        <h1>Pending Projects</h1>
        {data.length>0?
          <div className="projects-list">
            {data.map((project) => (
              <EmployeeCard key={project.id} formData={project} />
            ))}
          </div>
          :isEmpty?
          <p>No Pending Projects</p>
          :<div className='content-container'><Loading/></div>
        }

        </div>
  )
}

export default Employee;
