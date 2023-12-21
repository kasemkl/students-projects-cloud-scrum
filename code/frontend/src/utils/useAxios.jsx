import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'


const baseURL = 'http://127.0.0.1:8000'


const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers:{Authorization: `Bearer ${authTokens?.access}`}
    });


    axiosInstance.interceptors.request.use(async (req) => {
        try {
          const user = jwtDecode(authTokens.access);
          const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      
          if (!isExpired) {
            return req;
          }
      
          console.log('Refreshing token:', authTokens.refresh);
      
          const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: authTokens.refresh,
          });
      
          // Check for a successful response (status code 200)
            const newAuthTokens = response.data;
            setAuthTokens(newAuthTokens);
            localStorage.setItem('authTokens', JSON.stringify(newAuthTokens));
            setUser(jwtDecode(newAuthTokens.access));
            
            // Update the request header with the new access token
            req.headers.Authorization = `Bearer ${newAuthTokens.access}`;
        
            // Handle unexpected response status codes (e.g., 401)
      
          return req;
        } catch (error) {
          // Handle decoding errors or other unexpected errors
          console.error('Error refreshing token:', error);
          return req; // Return the original request to prevent blocking the request
        }
      });
      
    
    return axiosInstance
}

export default useAxios;