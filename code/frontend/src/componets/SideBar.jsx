import React, { useContext, useState } from "react";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import UserInfoContext from "../context/UserInfoContext";
import Notifications from './../pages/Notifications';

const SideBar = () => {
    let {user,logoutUser}=useContext(AuthContext)
    const {userInfo}=useContext(UserInfoContext)
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const {notifications}=useContext(UserInfoContext)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="logo-details">
        <i className="bx bxs-graduation icon"></i>
        <div className="logo_name">GradutionLab</div>
        <i
          className={`bx ${isSidebarOpen ? "bx-menu-alt-right" : "bx-menu"}`}
          id="btn"
          onClick={toggleSidebar}
        ></i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>

        <li>
          <Link to="/projects">
          <i className='bx bx-book-bookmark'></i>
            <span className="links_name">Projects</span>
          </Link>
          <span className="tooltip">Projects</span>
        </li>

        {userInfo.groups.includes("admin") ?
         <>
         <li>
         <Link to="Logging">
         <i className='bx bx-food-menu'></i>
           <span className="links_name">Logging </span>
         </Link>
         <span className="tooltip">Logging</span>
       </li>
         <li>
         <Link to="add-user">
           <i className="bx bx-user-plus"></i>
           <span className="links_name">Add User </span>
         </Link>
         <span className="tooltip">Add User</span>
       </li>
         </>
       :
        
        <>
        {userInfo.groups.includes("employee") ? (
          <li>
            <Link to="employee">
              <i className="bx bxs-add-to-queue"></i>
              <span className="links_name">Pending Projects</span>
            </Link>
            <span className="tooltip">Pending Projects</span>
          </li>
        ) 
        
        : 
        
        (
          <>
                <li>
                  <Link to="/sugg-list">
                    <i className="bx bxs-book-add"></i>
                    <span className="links_name">Suggestion Projects</span>
                  </Link>
                  <span className="tooltip">Suggestion Projects</span>
                </li>


            {userInfo.groups.includes("supervisor") && (
              <li>
                <Link to="/add-sugg">
                  <i className="bx bx-add-to-queue"></i>
                  <span className="links_name">Add Suggestion </span>
                </Link>
                <span className="tooltip">Add Suggestion </span>
              </li>
            )}


                    {userInfo.groups.includes("student")? (
                      <li>
                        <Link to="inbox">
                          <i className="bx bx-message-alt-add"></i>
                          <span className="links_name">Requests</span>
                        </Link>
                        <span className="tooltip">Requests</span>
                      </li>
                    ) : (
                      <li>
                        <Link to="supervisor-inbox">
                          <i className="bx bx-message-alt-add"></i>
                          <span className="links_name">Requests</span>
                        </Link>
                        <span className="tooltip">Requests</span>
                      </li>
                    )}


            {!userInfo.groups.includes("manager") && (
              <li>
                <Link to="my-requests">
                  <i className="bx bxs-message-alt-edit"></i>
                  <span className="links_name">MY Requests</span>
                </Link>
                <span className="tooltip">My Requests</span>
              </li>
            )}
            <li>
              <Link to="my-projects">
                <i className="bx bx-pie-chart-alt-2"></i>
                <span className="links_name">My projects</span>
              </Link>
              <span className="tooltip">My projects</span>
            </li>
        {userInfo.type==='student'&&
        <li>
          <Link to="add-project-request">
          <i className='bx bxs-plus-circle'></i>
            <span className="links_name">Add Project Request</span>
          </Link>
          <span className="tooltip">Add Project Request</span>
        </li>}
          </>
        )}
        *



        {userInfo.groups.includes("manager") && (
          <>
            <li>
              <Link to="manager-request-list">
                <i className="bx bx-book-alt"></i>
                <span className="links_name">Suggestion Requests </span>
              </Link>
              <span className="tooltip">Suggetions Requests</span>
            </li>
            <li>
              <Link to="add-committee">
              <i className='bx bxs-user-plus'></i>
                <span className="links_name">Add Committee </span>
              </Link>
              <span className="tooltip">Add Committee</span>
            </li>
          </>
        )}







        <li>
          <Link to="notifications">
            <i className="bx bxs-bell">
            </i>
          {notifications.length>0&&<span id="cart-total">{notifications.length}</span>}
            <span className="links_name">Notifications</span>
          </Link>
          <span className="tooltip">Notifications</span>
        </li>


            </>}



        <li>
          <Link to="/settings">
            <i className="bx bx-cog"></i>
            <span className="links_name">Setting</span>
          </Link>
          <span className="tooltip">Setting</span>
        </li>


            <li className="profile">
              <div className="profile-details">
                <img src={userInfo.profile_photo} alt="profileImg" />
                <div className="name_job">
                  <div className="name">
                    {userInfo.first_name} {userInfo.last_name}
                  </div>
                  <div className="job">{userInfo.type}</div>
                </div>
              </div>
              <i className="bx bx-log-out" id="log_out" onClick={logoutUser}></i>
            </li>


      </ul>
    </div>
  );
};

export default SideBar;
