import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import logo from '/logo.svg';

function Navbar() {
  const { user, handleLogout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `font-bold text-lg transition-colors duration-300 ${
      isActive ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block py-2 px-4 text-lg rounded-md ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-lg border-b border-gray-700 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Desktop Links */}
          <div className="flex items-center space-x-8">
            <NavLink to="/">
              <img src={logo} alt="Logo" className="h-10 w-10 hover:opacity-80 transition-opacity" />
            </NavLink>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/products" className={navLinkClass}>Products</NavLink>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <NavLink to="/logs" className={navLinkClass}>Activity</NavLink>
            </div>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <span className="font-semibold text-lg text-green-400">
                ${parseFloat(user.balance).toFixed(2)}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 rounded-b-lg shadow-xl p-4 space-y-2">
          <NavLink to="/" className={mobileNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/products" className={mobileNavLinkClass}>Products</NavLink>
          <NavLink to="/profile" className={mobileNavLinkClass}>Profile</NavLink>
          <NavLink to="/logs" className={mobileNavLinkClass}>Activity</NavLink>
          <div className="border-t border-gray-700 pt-4 space-y-4">
            {user && (
                <div className="text-center font-semibold text-lg text-green-400">
                    Balance: ${parseFloat(user.balance).toFixed(2)}
                </div>
            )}
            <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;