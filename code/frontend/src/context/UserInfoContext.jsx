import { createContext, useContext, useState,useEffect } from "react";
import React from 'react'
import useAxios from "../utils/useAxios";
import AuthContext from "./AuthContext";



const UserInfoContext=createContext()

export default UserInfoContext; 

export  const UserInfoProvider=({children})=>{
  const {user,authtokens,loginUser,logoutUser,removeInfo,isLoggedIn}=useContext(AuthContext)
  const [isEmpty,setIsEmpty]=useState(false)
  const api=useAxios()
  const [notifications,setNotifications]=useState([])
    const [userInfo,setUserInfo]=useState({
      university_id:'',
      first_name:'',
      last_name:'',
      email:'',
      type:'',
      groups:[],
      profile_photo:''
    })

    const [load,setLoad]=useState(true)

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await api.get('/user/');
            if (response.status === 200) {
              const completeUserInfo = {
                ...response.data,
                profile_photo: `http://127.0.0.1:8000${response.data.profile_photo}`,
              };
              setUserInfo(completeUserInfo);
            }
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
        };
        if(user)
        fetchData();
      }, [user]);


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
                
                setLoad(!load)

            } 
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
      }



      useEffect(() => {
          // Fetch the list of departments

            const fetchNotifications = async () => {
            try {
                const response = await api.get(`/notifications/`);
                if (response.status === 200) {
              const rawData=response.data
            const dataArray = Object.keys(rawData).map(key => ({
              id: key,
              ...rawData[key],
            }));

            dataArray.reverse()
            setNotifications(dataArray)
            if(dataArray.length === 0 ){
              setIsEmpty(true)
          }
      

                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        if(user)
        fetchNotifications();
        const timerId = setInterval(() => {
          if(user)
          fetchNotifications();
        }, 10000);
    
        // Clean up the interval when the component is unmounted
        return () => clearInterval(timerId);
        }, [user]);

useEffect(()=>{
  if(!isLoggedIn){
  setUserInfo({
    university_id:'',
    first_name:'',
    last_name:'',
    email:'',
    type:'',
    groups:[],
    profile_photo:''
  })
  setNotifications([])
}
},[user])
const Data={
    userInfo:userInfo,
    notifications:notifications,
    isEmpty:isEmpty,
    updateUserInfo:updateUserInfo,
    setUserInfo:setUserInfo,
    setNotifications:setNotifications
}
return (
    <UserInfoContext.Provider value={Data}>
        {children}
    </UserInfoContext.Provider>
)
}