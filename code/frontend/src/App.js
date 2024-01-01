
import { useContext, useState, useEffect } from 'react';
import SuggProjectsList from './pages/SuggProjectsList';
import {Link,Route,Routes } from 'react-router-dom'
import Request from './componets/Request'
import ManagerRequestList from './pages/ManagerRequestList'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import AuthContext, { AuthProvider } from './context/AuthContext';
import SignUp from './pages/SignUp';
import SettingsPage from './pages/SettingsPage';
import { UserInfoProvider } from './context/UserInfoContext';
import SideBar from './componets/SideBar';
import { useNavigate,useLocation } from 'react-router-dom';
import Myrequests from './pages/Myrequests';
import { RenderProvider } from './context/RenderContext';
import Inbox from './pages/Inbox';
import SupervisorInbox from './pages/SupervisorInbox';
import MyProject from './pages/MyProject';
import Notifications from './pages/Notifications';
import Employee from './pages/Employee';
import AddUser from './pages/AddUser';
import AddProjectRequest from './pages/AddProjectRequest';

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
        <RenderProvider>

        {renderSideBar&& <SideBar/>}
        <div className={renderSideBar?'home-section':'Form'}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path='/sugg-list' element={<PrivateRoute element={<SuggProjectsList />}/>} />
          <Route path='/manager-request-list' element={<PrivateRoute element={<ManagerRequestList />}/>} />
          <Route path='/add-sugg' element={<PrivateRoute element={<Request />}/>} />
         <Route path='/sign-up' element={<SignUp />} /> 
          <Route path='/settings' element={<PrivateRoute element={<SettingsPage/>}/>} /> 
          <Route path='/my-requests' element={<PrivateRoute element={<Myrequests/>} />}/> 
          <Route path='/inbox' element={<PrivateRoute element={<Inbox/>} />}/> 
          <Route path='/supervisor-inbox' element={<PrivateRoute element={<SupervisorInbox/>}/>} /> 
          <Route path='/my-projects' element={<PrivateRoute element={<MyProject/>}/>} /> 
          <Route path='/notifications' element={<PrivateRoute element={<Notifications/>}/>} /> 
          <Route path='/employee' element={<PrivateRoute element={<Employee/>}/>} /> 
          <Route path='/add-user' element={<PrivateRoute element={<AddUser/>}/>} /> 
          <Route path='/add-project-request' element={<PrivateRoute element={<AddProjectRequest/>}/>} /> 
          
        </Routes>
        </div>
        </RenderProvider>
        </UserInfoProvider>
      </AuthProvider>
      </div>
  );
}

export default App;
