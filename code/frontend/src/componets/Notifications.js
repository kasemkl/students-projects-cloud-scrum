import React, { useContext, useState,useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import useAxios from '../utils/useAxios';
import AuthContext from '../context/AuthContext';
import '../styles/notification.css'
const Notifications = () => {
    const api=useAxios()
    const [notification,setNotification]=useState([])
    const {user}=useContext(AuthContext)

    useEffect(() => {
        // Fetch the list of departments
        const fetchData = async () => {
          try {
              console.log(user.university_id)
              const response = await api.get(`/notifications/${user.university_id}`);
              if (response.status === 200) {
                  // console.log('departments', response.data);
                  const rawData=response.data
          const dataArray = Object.keys(rawData).map(key => ({
            id: key,
            ...rawData[key],
          }));
            setNotification(dataArray)
            console.log(notification)
              }
          } catch (error) {
              console.error('Error fetching requests:', error);
          }
      };
      fetchData();
      const timerId = setInterval(() => {
        fetchData();
      }, 10000);
  
      // Clean up the interval when the component is unmounted
      return () => clearInterval(timerId);
      }, []);

    return (
    <div>
       <NavDropdown title={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
</svg>} id="basic-nav-dropdown">
            {notification.length >0 ?(
              notification.map((element)=>(
            <NavDropdown.ItemText key={element.id}> <div className='noti'>
              <span className='msg'>{element.message}</span> <span className='date'>{element.date}</span>
              </div>
              </NavDropdown.ItemText>))):
            (<NavDropdown.ItemText >No Notifications</NavDropdown.ItemText>)
          }
            </NavDropdown>
    </div>
  )
}

export default Notifications
