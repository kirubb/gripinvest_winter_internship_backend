import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        { email, password }
      )
      onLogin(response.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <p className="bg-red-500 text-white p-3 rounded-md text-center mb-4">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-indigo-400"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          <div className="text-center mt-4">
    <Link to="/forgot-password" className="text-sm text-indigo-400 hover:underline">Forgot Password?</Link>
</div>

        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage