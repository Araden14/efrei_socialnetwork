import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MessagingApp from '../components/MessagingApp';
import Login from '../components/Login';
import Register from '../components/Register';
import WebSocketComponent from '../components/websocket';
import { useAuth } from '../context/authcontext';

const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MESSAGING: '/messagerie',
    WEBSOCKET: '/websocket',
}

interface UserType {
  id: number;
  name: string;
  email: string;
}

interface RegisterProps {
  onRegister: (data: { token: string; email: string; name: string }) => void;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

interface PublicRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

function ProtectedRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = ROUTES.LOGIN 
}: ProtectedRouteProps): React.JSX.Element {
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

function PublicRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = ROUTES.MESSAGING 
}: PublicRouteProps): React.JSX.Element {
  return !isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

export default function AppRoutes(): React.JSX.Element {
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);

  // Convert auth user to the format expected by MessagingApp
  const getUserForMessaging = (): UserType => {
    if (user) {
      return {
        id: parseInt(user.id),
        name: user.name,
        email: user.email
      };
    }
    return { id: 0, name: '', email: '' };
  };

  // Function to handle registration
  const handleRegister = (data: { token: string; email: string; name: string }) => {
  };

  return (
    <Routes>
      <Route
        path={ROUTES.MESSAGING}
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MessagingApp 
              user={getUserForMessaging()} 
              onLogout={logout} 
            />
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Register onRegister={handleRegister} />
          </PublicRoute>
        }
      />
      
      <Route
        path={ROUTES.WEBSOCKET}
        element={<WebSocketComponent />}
      />
      
      <Route
        path={ROUTES.HOME}
        element={
          <Navigate 
            to={isAuthenticated ? ROUTES.MESSAGING : ROUTES.LOGIN} 
            replace 
          />
        }
      />
      
      <Route
        path="*"
        element={
          <Navigate 
            to={isAuthenticated ? ROUTES.MESSAGING : ROUTES.LOGIN} 
            replace 
          />
        }
      />
    </Routes>
  );
} 