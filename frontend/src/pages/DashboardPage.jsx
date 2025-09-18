import React, { useState, useEffect } from 'react'
import apiClient from '../api'
import Navbar from '../components/Navbar'

function DashboardPage() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await apiClient.get('/investments')
        setPortfolio(response.data)
      } catch (error) {
        console.error('Failed to fetch portfolio', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {loading ? (
            <p>Loading portfolio...</p>
          ) : portfolio.length > 0 ? (
            <ul>
              {portfolio.map((investment) => (
                <li key={investment.id} className="border-b border-gray-700 py-2">
                  <span className="font-bold">{investment.product_name}</span> - ${investment.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no investments yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage