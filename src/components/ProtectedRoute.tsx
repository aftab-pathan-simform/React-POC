
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoginPage from './Auth/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
