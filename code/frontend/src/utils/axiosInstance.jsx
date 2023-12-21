import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'


const baseURL='http://localhost:8000/'

let authTokens=localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null

const axiosIstance=axios.create({
    baseURL,
    headers:{Authorization:`Bearer ${authTokens?.access}`}
})
axiosIstance.interceptors.request.use(async req=> {
    if(!authTokens){
        authTokens=localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
        console.log('interceptor is ran ')
        req.headers.Authorization=`Bearer ${authTokens?.access}`
    }
    const user=jwtDecode(authTokens.access)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log('isExpired',isExpired)
    if(!isExpired) return req

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: authTokens.refresh
      });

    localStorage.setItem('authTokens', JSON.stringify(response.data))
    req.headers.Authorization = `Bearer ${response.data.access}`
    return req
})

export default axiosIstance;