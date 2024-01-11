import React, { useContext, useEffect, useState } from 'react'
import useAxios from '../utils/useAxios'
import RenderContext from '../context/RenderContext'
import Loading from '../componets/Loading'

const Logging = () => {

    const [logging,setLogging]=useState([])
    const api=useAxios()
    const {render}=useContext(RenderContext)
    const [isEmpty,setIsEmpty]=useState(false)
    useEffect(()=>{

        const fetchData=async()=>{
            try{
            let response=await api.get('/logging/')
            console.log(response.data)
            const rawData = response.data;
            const dataArray = Object.keys(rawData).map(key => ({
              id: key,
              ...rawData[key],
            }));
            setLogging(dataArray);
            if(dataArray.length===0){
                setIsEmpty(true)
            }
        }
            catch(error){
                console.log('error during fetch data',error)
            }
        }
    fetchData()
    },[render])
  return (
    <div className='container'>
            <h2>Logging:</h2>
            {logging.length>0 ? 
             logging.map(logg=>{
                return (
                    <div className="card">
        <div className="card-body">
        
          <div className="card-content">
            <p className="card-text">
             {logg.action}
            </p>
            <p className="card-text">
             {logg.date}
            </p>
            </div>
            </div>
            </div>
                )
            })
            :
            isEmpty? <p>No logging</p>:<Loading/>}

        </div>
  )
}

export default Logging
