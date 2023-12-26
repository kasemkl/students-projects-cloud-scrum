import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import ProjectsList from '../pages/ProjectsList'
import '../styles/sidebar.css'

const HomePage = () => {
    return (
        <div>
            <ProjectsList/>
        </div>
    )
}

export default HomePage