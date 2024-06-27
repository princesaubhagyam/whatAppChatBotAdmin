import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem('ref') && localStorage.getItem('access_app'); // or wherever you store your token

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default AuthWrapper;
