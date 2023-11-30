import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import Nav from '../componets/Nav'
import ProjectsList from '../componets/ProjectsList'


const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    let api=useAxios()
    

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() =>{
        // let response = await fetch('http://127.0.0.1:8000/menu/', {
        //     method:'GET',
        //     headers:{
        //         'Content-Type':'application/json',
        //         'Authorization':'Bearer ' + String(authTokens.access)
        //     }
        // })
        // let data = await response.json()
        let response =await api.get('/menu/')
        if(response.status === 200){
          console.log('menu',response.data)
            setNotes(response.data)
        }
        // else if(response.statusText === 'Unauthorized'){
        //     logoutUser()
        // }
        
    }

    return (
        <div>
            <ProjectsList/>
            {/* <ul>
                {notes.map(note => (
                    <li key={note.id} >{note.name}</li>
                ))}
            </ul> */}
        </div>
    )
}

export default HomePage