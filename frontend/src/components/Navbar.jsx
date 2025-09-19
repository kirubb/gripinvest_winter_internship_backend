import React from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../context/UserContext.jsx'
import logo from '/logo.svg'

function Navbar({ onLogout }) {
  const { user } = useUser()

  const navLinkClass = ({ isActive }) =>
    `font-bold text-lg transition-colors duration-300 ${
      isActive ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
    }`

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 mb-8 rounded-lg shadow-lg flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center space-x-8">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="h-10 w-10 hover:opacity-80 transition-opacity" />
        </NavLink>
        <div className="flex items-center space-x-6">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
          <NavLink to="/logs" className={navLinkClass}>Activity</NavLink> 
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {user && (
          <div className="flex items-center space-x-2 text-green-400">
            <span className="font-semibold text-lg">
              ${parseFloat(user.balance).toFixed(2)}
            </span>
          </div>
        )}
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Log Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar