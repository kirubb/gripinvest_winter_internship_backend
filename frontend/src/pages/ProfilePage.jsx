import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext.jsx';
import apiClient from '../api';

function ProfilePage({ onLogout }) {
  const { user, updateUser, loading } = useUser();
  const [riskAppetite, setRiskAppetite] = useState('');
  const [addBalance, setAddBalance] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setRiskAppetite(user.risk_appetite);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await apiClient.put('/user/profile', { risk_appetite: riskAppetite });
      updateUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setMessage('Risk appetite updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();
    setMessage('');
    if (parseFloat(addBalance) <= 0 || isNaN(parseFloat(addBalance))) {
      setMessage('Please enter a valid positive amount.');
      return;
    }
    try {
      const response = await apiClient.put('/user/profile', { addBalance: parseFloat(addBalance) });
      updateUser(response.data.user);
      setAddBalance('');
      setMessage('Balance added successfully!');
    } catch (error) {
      setMessage('Failed to add balance.');
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar onLogout={onLogout} />
        <h1 className="text-3xl font-bold mb-8">Your Profile & Settings</h1>

        {message && (
          <div className="bg-green-500 bg-opacity-75 text-white p-3 rounded-md text-center mb-6 max-w-lg mx-auto">
            {message}
          </div>
        )}
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="space-y-2">
                <p><span className="font-bold text-gray-400">First Name:</span> {user.first_name}</p>
                <p><span className="font-bold text-gray-400">Last Name:</span> {user.last_name}</p>
                <p><span className="font-bold text-gray-400">Email:</span> {user.email}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Update Risk Appetite</h2>
            <form onSubmit={handleProfileUpdate}>
              <label htmlFor="risk" className="block text-sm font-bold mb-2">
                Select your risk tolerance
              </label>
              <select
                id="risk"
                value={riskAppetite}
                onChange={(e) => setRiskAppetite(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Save Preference
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add to Balance</h2>
            <form onSubmit={handleAddBalance}>
              <label htmlFor="balance" className="block text-sm font-bold mb-2">
                Amount to add ($)
              </label>
              <input
                type="number"
                id="balance"
                value={addBalance}
                onChange={(e) => setAddBalance(e.target.value)}
                placeholder="e.g., 5000"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                min="1"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Add Funds
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;