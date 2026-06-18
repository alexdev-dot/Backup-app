import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SupportPage from './pages/SupportPage';
import CustomerDashboard from './pages/Customers/CustomerDashboard';
import ProfessionalDashboard from './pages/Professionals/ProfessionalDashboard';

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role);
    }
  }, []);

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(user.role);
    if (user.role === 'professional') {
      navigate('/professional/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to={userRole === 'professional' ? '/professional/dashboard' : '/customer/dashboard'} replace />
          ) : (
            <AuthPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/customer/*"
        element={
          isAuthenticated && (userRole === 'customer' || userRole === 'admin') ? (
            <CustomerDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/professional/*"
        element={
          isAuthenticated && (userRole === 'professional' || userRole === 'admin') ? (
            <ProfessionalDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
