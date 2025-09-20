import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext.jsx';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import LogsPage from './pages/LogsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppRoutes() {
  const { token, loading } = useUser();

  if (loading) {
    return <div className="min-h-screen bg-gray-900" />;
  }

  return (
    <Routes>
      <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/" />} />
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!token ? <ForgotPasswordPage /> : <Navigate to="/" />} />
      <Route path="/reset-password/:token" element={!token ? <ResetPasswordPage /> : <Navigate to="/" />} />
      
      <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/products" element={token ? <ProductsPage /> : <Navigate to="/login" />} />
      <Route path="/products/:productId" element={token ? <ProductDetailPage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/logs" element={token ? <LogsPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;