import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/reset-password', { token, password });
      setMessage(response.data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          {message && <p className="bg-green-500/50 text-white p-3 rounded-md text-center mb-4">{message}</p>}
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg" required
          />
          <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg">
            Set New Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;