import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 p-4 mb-8 rounded-lg shadow-lg flex justify-between items-center">
      <div>
        <Link to="/" className="text-white font-bold text-xl mr-6 hover:text-indigo-400">Dashboard</Link>
        <Link to="/products" className="text-white font-bold text-xl hover:text-indigo-400">Products</Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Log Out
      </button>
    </nav>
  )
}

export default Navbar