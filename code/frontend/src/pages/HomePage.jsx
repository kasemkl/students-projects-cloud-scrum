import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import ProjectsList from '../pages/ProjectsList'
import '../styles/sidebar.css'
import AdvertsCard from '../componets/AvertsCard'
import { Link } from 'react-router-dom'
import RenderContext from '../context/RenderContext'
import Loading from '../componets/Loading'
import UserInfoContext from '../context/UserInfoContext'

const HomePage = () => {
    const [advertsiments,setAdvertsiments]=useState([])
    const api=useAxios()
    const {render}=useContext(RenderContext)
    const [isEmpty,setIsEmpty]=useState(false)
    const {userInfo}=useContext(UserInfoContext)


useEffect(()=>{

    const fetchData=async()=>{
        try{
        let response=await api.get('/advert/')
        console.log(response.data)
        const rawData = response.data;
        const dataArray = Object.keys(rawData).map(key => ({
          id: key,
          ...rawData[key],
        }));
        setAdvertsiments(dataArray);
        if(dataArray.length===0)
        setIsEmpty(true)
    }
        catch(error){
            console.log('error during fetch data',error)
        }
    }
fetchData()
},[render])

    return (
      <div className="container">
        <h2>Advertsiments:</h2>
        {userInfo.groups.includes("committee") && (
          <Link to="add-advert" className="add-advert">
            <i className="bx bx-plus"></i> Add advertsiment
          </Link>
        )}
        {advertsiments.length > 0 ? (
          advertsiments.map((advertsiment) => {
            return (
              <AdvertsCard key={advertsiment.id} formData={advertsiment} />
            );
          })
        ) : isEmpty ? (
          <p>No Advertsiments</p>
        ) : (
          <div className="content-container">
            <Loading />
          </div>
        )}
      </div>
    );
}

export default HomePage