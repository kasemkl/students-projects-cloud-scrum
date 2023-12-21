import logo from './logo.svg';

import Sign from './componets/Sign'
import LoginForm from './componets/LoginForm';
import { useContext, useState, useEffect } from 'react';
import SuggProjectsList from './componets/SuggProjectsList';
import Card from './componets/Card';
import Nav from './componets/Nav';
import {Link,Route,Routes } from 'react-router-dom'
import Request from './componets/Request'
import ProjectsList from './componets/ProjectsList'
import ManagerRequestList from './componets/ManagerRequestList'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import AuthContext, { AuthProvider } from './context/AuthContext';
import SignUp from './componets/SignUp';
import { BrowserRouter as Router} from 'react-router-dom'
import ImageForm from './componets/ImageForm';
import Notifications from './componets/Notifications';
import Header from './componets/Header';
import ContextualExample from './componets/ContextualExample';
import SettingsPage from './pages/SettingsPage';
import { UserInfoProvider } from './context/UserInfoContext';
import SideBar from './componets/SideBar';
import { useNavigate,useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const currentRoute = location.pathname;

  const renderSideBar = (currentRoute !== '/sign-up' && currentRoute !== '/login')
  return (
    <div className="">
      {/* <Nav />
      <Routes>
        <Route path='/' element={<Home><ProjectsList /></Home>} />
        <Route path='/sugg-list' element={<MyComponent />} />
        <Route path='/manager-request-list' element={<ManagerRequestList />} />
        <Route path='/add-sugg' element={<Request />} />
      </Routes> */}
       
      <AuthProvider>
        <UserInfoProvider>

        {renderSideBar&& <SideBar/>}
        <div className={renderSideBar?'home-section':'Form'}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path='/sugg-list' element={<SuggProjectsList />} />
          <Route path='/manager-request-list' element={<ManagerRequestList />} />
          <Route path='/add-sugg' element={<Request />} />
         <Route path='/sign-up' element={<SignUp />} />
          <Route path='/image' element={<ImageForm/>} /> 
          <Route path='/toast' element={<Notifications/>} /> 
          <Route path='/settings' element={<SettingsPage/>} /> 
          
        </Routes>
        </div>
        </UserInfoProvider>
      </AuthProvider>
      </div>
  );
}

export default App;
