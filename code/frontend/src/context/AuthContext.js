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


    
    let loginUser = async (formData )=> {
        // e.preventDefault()
        console.log('formData',formData)
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'university_id':formData.university_id, 'password':formData.password})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            console.log(user)
            navigate('/')  
        }else{
            alert('Something went wrong!')
        }
    }   
      
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

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
        setUser:setUser
            }
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
