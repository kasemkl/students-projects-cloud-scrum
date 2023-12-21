import { createContext, useContext, useState,useEffect } from "react";
import React from 'react'
import useAxios from "../utils/useAxios";
import AuthContext from "./AuthContext";



const UserInfoContext=createContext()

export default UserInfoContext; 

export  const UserInfoProvider=({children})=>{
    const {user,authtokens,loginUser,logoutUser}=useContext(AuthContext)
    const api=useAxios()
    const [userInfo,setUserInfo]=useState({
      university_id:'',
      first_name:'',
      last_name:'',
      email:'',
      type:'',
      profile_photo:''
    })
    const [load,setLoad]=useState(true)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/user/');
            if (response.status === 200) {
              console.log(response.data)
              const completeUserInfo = {
                ...response.data,
                profile_photo: `http://127.0.0.1:8000${response.data.profile_photo}`,
              };
              setUserInfo(completeUserInfo);
            console.log(userInfo)
            }
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
        };
    
        fetchData();
      }, [load,authtokens,logoutUser,loginUser]);

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
    userInfo:userInfo,
    updateUserInfo:updateUserInfo
}
return (
    <UserInfoContext.Provider value={Data}>
        {children}
    </UserInfoContext.Provider>
)
}