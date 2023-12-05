import { useContext,useState,useEffect, createContext } from 'react'
import { jwtDecode } from "jwt-decode";
import React from 'react'
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext()

export default AuthContext

export const AuthProvider=({children})=>{
    
    const navigate=useNavigate()
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    const [isLoggedIn,setIsLoggedin]=useState(true)
    let [loading, setLoading] = useState(true)


    
    let loginUser = async (formData) => {
        try {
          let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'university_id': formData.university_id,
              'password': formData.password,
            }),
          });
      
          if (response.ok) {
            let data = await response.json();
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            console.log(user);
            navigate('/');
          } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            // You may want to provide a more specific error message based on the response
            alert('Login failed. Please check your credentials.');
          }
        } catch (error) {
          console.error('An unexpected error occurred during login:', error);
          alert('Something went wrong. Please try again later.');
        }
      };
      
      
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let registerUser = async (formData) => {
        try {
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });
            console.log('form',formDataObj)
            let response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                body: formDataObj,
            });
    
            let data = await response.json();
    
            if (response.status === 201) {
                console.log(data)
                loginUser(formData)
            } else {
                console.log(data, '', response.status);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };
    
    // let updateToken = async ()=> {
    //     console.log('update token ')
    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({'refresh':authTokens?.refresh})
    //     })

    //     let data = await response.json()
        
    //     if (response.status === 200){
    //         setAuthTokens(data)
    //         setUser(jwtDecode(data.access))
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //         console.log(data)
    //     }else{
    //         logoutUser()
    //     }

    //     if(loading){
    //         setLoading(false)
    //     }
    // }
    // useEffect(()=> {

    //     if(loading){
    //         updateToken()
    //     }

    //     let fourMinutes = 1000 *60*4

    //     let interval =  setInterval(()=> {
    //         if(authTokens){
    //             updateToken()
    //         }
    //     }, fourMinutes)
    //     return ()=> clearInterval(interval)

    // }, [authTokens, loading])

    useEffect(()=>{

        if(authTokens){
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)

    },[authTokens,loading])

    const contextData={
        user:user,
        isLoggedIn:isLoggedIn,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser ,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        registerUser:registerUser
            }
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
