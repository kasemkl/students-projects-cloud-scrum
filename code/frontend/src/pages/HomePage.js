import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'
import Nav from '../componets/Nav'
import ProjectsList from '../componets/ProjectsList'


const HomePage = () => {
    return (
        <div>
            <ProjectsList/>
        </div>
    )
}

export default HomePage