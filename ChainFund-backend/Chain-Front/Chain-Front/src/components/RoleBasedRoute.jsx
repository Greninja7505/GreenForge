/**
 * Role-Based Route Component
 * Protects routes based on user roles
 */

import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RoleBasedRoute = ({ children, allowedRoles = [], feature, fallbackPath = '/dashboard' }) => {
  const { isLoggedIn, canAccess, hasRole } = useUser();

  // Must be logged in
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  // Check feature access if specified
  if (feature && !canAccess(feature)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific roles if specified
  if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;