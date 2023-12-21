import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
const PrivateRoute = ({ element, ...rest }) => {
  console.log('private route works');

  // Add your authentication logic here
  let { user } = useContext(AuthContext);
  // Replace with your actual authentication check

  return !user ? <Navigate to="/login" /> : element;
};

export default PrivateRoute;
