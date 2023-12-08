import React from 'react'
import Profile from './Profile'
import { Link } from 'react-router-dom'

const Settings = ({data}) => {

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          <h2 className="h3 mb-4 page-title">Settings</h2>
          <div className="my-4">
            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                {data.map((row,index)=> 
              <li className="nav-item" key={index}>
                <a className="nav-link active" id="home-tab" data-toggle="tab"  role="tab" aria-controls="home" aria-selected="false">{row}</a>
              </li>
                  )}
            </ul>

            <Profile/>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
