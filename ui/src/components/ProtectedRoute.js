import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

function ProtectedRoute({ element, ...rest }) {
  const { currentUser } = useAuth();

  return currentUser
    ? <Route element={element} {...rest} /> // If authenticated, render the route
    : <Navigate to="/unauthorized" /> // If not authenticated, redirect to unauthorized page
}

export default ProtectedRoute;
