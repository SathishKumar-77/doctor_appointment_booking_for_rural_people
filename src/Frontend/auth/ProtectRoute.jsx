import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log('Auth0 user:', user);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Allowed Roles:', allowedRoles);

 
  

  const userRoles = user && user['https://yourapp.com/roles'];
  console.log('User roles:', userRoles);

  const hasAccess = userRoles?.some(role => allowedRoles.includes(role));
  console.log('Has access:', hasAccess);

  if (!isAuthenticated || !hasAccess) {
    console.warn('Access denied');
    return <Navigate to="/" replace />;
  }

  console.log('Access granted');
  return children;
};

export default ProtectedRoute;
