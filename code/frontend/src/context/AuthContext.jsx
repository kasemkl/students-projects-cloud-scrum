import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    let [isLoggedIn,setIsLoggedIn]=useState(false)

    const history = useNavigate()

    let loginUser = async (formData )=> {

        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
              'university_id': formData.university_id,
              'password': formData.password,
            }),        
          })
        let data = await response.json()
        console.log(data)
        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            setIsLoggedIn(true)
            history('/')
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
      setAuthTokens(null);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('authTokens');
      history('/login');
    };
    
  
    let registerUser = async (formData) => {
      try {
          const formDataObj = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
              formDataObj.append(key, value);
          });
  
          console.log('form', formDataObj);
  
          // Return the fetch promise
          return fetch('http://127.0.0.1:8000/register/', {
              method: 'POST',
              body: formDataObj,
          });
          
      } catch (error) {
          return error;
          console.error('Error fetching requests:', error);
          // If an error occurs, you might want to reject the promise here
      }
  };
  useEffect(()=> {

      if(authTokens){
          setUser(jwtDecode(authTokens.access))
      }
      setLoading(false)


  }, [authTokens, loading])

    let contextData = {
        user:user,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }



    return(
        <AuthContext.Provider value={contextData} >
            {loading  ? null : children}
        </AuthContext.Provider>
    )
}