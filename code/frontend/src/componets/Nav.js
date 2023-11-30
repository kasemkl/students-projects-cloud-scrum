import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';
import AuthContext from '../context/AuthContext';

export default function Nav() {
  let {user,logoutUser}=useContext(AuthContext)
  return (
    <header>
         <div className="navvv">
        <div className="logo">
          {/* <Link to="/">logo</Link> */}
            {user&&
            <p className="other"><Link to="/">hello {user.first_name}</Link></p>
            }
        </div>
        <div className="navbar">
        {user &&  <ul className="nav">
            <li className="other"><Link to="/sugg-list">suggestion projects</Link></li>
            {user && user.groups && (user.groups.includes('supervisor') || user.groups.includes('manager')) && <li className="other"><Link to="/add-sugg">add suggestion projects</Link></li>}
            <li className="other"><Link to="/manager-request-list">manger-list</Link></li>
            {user ?
            <li className="other" onClick={logoutUser}><Link to="/login">logout</Link></li>:
            <li className="other"><Link to="/login">login</Link></li>}
            </ul>}
        </div> 
        </div>
    </header>
  );
}
