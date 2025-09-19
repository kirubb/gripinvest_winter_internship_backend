import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SignupPage from './pages/SignupPage'
import { UserProvider } from './context/UserContext'
import ProfilePage from './pages/ProfilePage'



function App() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-900" />
  }

  return (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={token ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={token ? <ProductsPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/products/:productId"
          element={token ? <ProductDetailPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={token ? <ProfilePage onLogout={handleLogout} /> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
    </UserProvider>
  )
}

export default App