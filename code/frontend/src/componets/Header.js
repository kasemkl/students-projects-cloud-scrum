import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/header.css'
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
const Header = () => {
    let {user,logoutUser}=useContext(AuthContext)
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary NavBar" bg="dark" data-bs-theme="dark">
        <Container>
      {user && <Navbar.Brand href="/">
         <img
              src={require(`../../../backend${user.profile_photo}`)}
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span>
                {user.first_name}
                </span>
          </Navbar.Brand>}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {user &&<Navbar.Collapse id="basic-navbar-nav" className='NavBar'>
          <Nav className="">
            <Nav.Link href="/">projects</Nav.Link>
            <Nav.Link href="/sugg-list">suggestion</Nav.Link>
            {user && user.groups && (user.groups.includes('manager')) && 
            <Nav.Link href="/manager-request-list">Requests</Nav.Link>}

            <NavDropdown title="Options" id="basic-nav-dropdown">
            {user && user.groups && (user.groups.includes('supervisor') || user.groups.includes('manager')) &&
            <NavDropdown.Item href="/add-sugg">Add suggestion</NavDropdown.Item>}
            <NavDropdown.Item href="#action/3.2" onClick={logoutUser}>
               logout
            </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
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
