import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({children, ...rest}) => {
  const {user, isAuthenticated} = useAuth0(); 
  const isUser = user && isAuthenticated
  
  if (!isUser) {
    return <Navigate to='/login' />
  }
  
  return children
};
export default PrivateRoute;
