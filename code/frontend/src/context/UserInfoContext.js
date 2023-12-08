import { createContext, useContext, useState,useEffect } from "react";
import React from 'react'
import useAxios from "../utils/useAxios";
import AuthContext from "./AuthContext";



const UserInfoContext=createContext()

export default UserInfoContext; 

export  const UserInfoProvider=({children})=>{
    const {user}=useContext(AuthContext)
    const api=useAxios()
    const [userImage,setUserImage]=useState()
    const [load,setLoad]=useState(true)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/user/');
            if (response.status === 200) {
              setUserImage(`http://127.0.0.1:8000${response.data.profile_photo_url}`);
            }
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
        };
    
        fetchData();
      }, [load]);

      const updateUserInfo= async(formData)=>{
                try {

            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
              if (value !== null && value !=='') {
                formDataObj.append(key, value);
              }
            });
  
            console.log('form',formDataObj)
            let response = await api.post('/update-profile/',formDataObj);
            if (response.status === 200) {
                console.log(response.data)
                setLoad(!load)

            } else {
                console.log('data', '', response.status);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
      }

const Data={
    userImage:userImage,
    updateUserInfo:updateUserInfo
}
return (
    <UserInfoContext.Provider value={Data}>
        {children}
    </UserInfoContext.Provider>
)
}