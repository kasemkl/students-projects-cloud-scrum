import logo from './logo.svg';
import './App.css';
import Sign from './componets/Sign'
import LoginForm from './componets/LoginForm';
import { useContext, useState, useEffect } from 'react';
import SuggProjectsList from './componets/SuggProjectsList';
import Card from './componets/Card';
import Nav from './componets/Nav';
import {Link,Route,Routes ,Navigate} from 'react-router-dom'
import Request from './componets/Request'
import ProjectsList from './componets/ProjectsList'
import ManagerRequestList from './componets/ManagerRequestList'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import AuthContext, { AuthProvider } from './context/AuthContext';
import SignUp from './componets/SignUp';
import { BrowserRouter as Router} from 'react-router-dom'


function App() {

  return (
    <div className="">
      {/* <Nav />
      <Routes>
        <Route path='/' element={<Home><ProjectsList /></Home>} />
        <Route path='/sugg-list' element={<MyComponent />} />
        <Route path='/manager-request-list' element={<ManagerRequestList />} />
        <Route path='/add-sugg' element={<Request />} />
      </Routes> */}
       <Router>
      <AuthProvider>
        <Nav/>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path='/sugg-list' element={<SuggProjectsList />} />
          <Route path='/manager-request-list' element={<ManagerRequestList />} />
          <Route path='/add-sugg' element={<Request />} />
        </Routes>
      </AuthProvider>
    </Router>
      </div>
  );
}

export default App;
