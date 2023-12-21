import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/header.css'
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import Notifications from './Notifications';
import { Link } from "react-router-dom";
import UserInfoContext from '../context/UserInfoContext';

const Header = () => {
    let {user,logoutUser}=useContext(AuthContext)
    const {userInfo}=useContext(UserInfoContext)
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary NavBar" bg="dark" data-bs-theme="dark">
        <Container>
      {user && <Navbar.Brand as={Link} to="/settings">
         <img
              src={userInfo.profile_photo}
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span>
                {userInfo.first_name}
                </span>
          </Navbar.Brand>}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {user &&<Navbar.Collapse id="basic-navbar-nav" className='NavBar'>
          <Nav className="">
            <Nav.Link as={Link} to="/">projects</Nav.Link>
            <Nav.Link as={Link} to="/sugg-list">suggestion</Nav.Link>
            {user && user.groups && (user.groups.includes('manager')) && 
            <Nav.Link as={Link} to="/manager-request-list">Requests</Nav.Link>}
            <Notifications/>
            <NavDropdown title="Options" id="basic-nav-dropdown">
            {user && user.groups && (user.groups.includes('supervisor') || user.groups.includes('manager')) &&
            <NavDropdown.Item as={Link} to="/add-sugg">Add suggestion</NavDropdown.Item>}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
            <NavDropdown.Item  as={Link}to="/login" onClick={logoutUser}>
               logout
            </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>}
      </Container>
    </Navbar>
    </div>
  )
}

export default Header;
