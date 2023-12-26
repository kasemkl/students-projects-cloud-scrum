import React, { useContext, useState } from "react";
import "../styles/sidebar.css";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import UserInfoContext from "../context/UserInfoContext";

const SideBar = () => {
    let {user,logoutUser}=useContext(AuthContext)
    const {userInfo}=useContext(UserInfoContext)
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
          <i className="bx bx-search"></i>
          <input type="text" placeholder="Search..." />
          <span className="tooltip">Search</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>

        <li>
          <Link to="/sugg-list">
            <i className="bx bxs-book-add"></i>
            <span className="links_name">Suggestion Projects</span>
          </Link>
          <span className="tooltip">Suggestion Projects</span>
        </li>
        {userInfo.groups.includes('supervisor') &&
        <li>
          <Link to="/add-sugg">
            <i className="bx bx-add-to-queue"></i>
            <span className="links_name">Add Suggestion </span>
          </Link>
          <span className="tooltip">Add Suggestion </span>
        </li>}
          {userInfo.type === "student" ? (
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
          {userInfo.groups.includes('supervisor') &&
        <li>
          <Link to="my-requests">
            <i className="bx bxs-message-alt-edit"></i>{" "}
            <span className="links_name">MY Requests</span>
          </Link>
          <span className="tooltip">My Requests</span>
        </li>}
        {userInfo.groups.includes("manager") && (
          <li>
            <Link to="manager-request-list">
              <i className="bx bx-book-alt"></i>
              <span className="links_name">Suggestion Requests </span>
            </Link>
            <span className="tooltip">Suggetions Requests</span>
          </li>
        )}
        {/*<li>
          <Link to="#">
            <i className="bx bx-pie-chart-alt-2"></i>
            <span className="links_name">Analytics</span>
          </Link>
          <span className="tooltip">Analytics</span>
        </li>
        <li>
          <Link to="#">
            <i className="bx bx-folder"></i>
            <span className="links_name">File Manager</span>
          </Link>
          <span className="tooltip">Files</span>
        </li>
        <li>
          <Link to="#">
            <i className="bx bx-cart-alt"></i>
            <span className="links_name">Order</span>
          </Link>
          <span className="tooltip">Order</span>
        </li>
        <li>
          <Link to="#">
            <i className="bx bx-heart"></i>
            <span className="links_name">Saved</span>
          </Link>
          <span className="tooltip">Saved</span>
        </li> */}
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
