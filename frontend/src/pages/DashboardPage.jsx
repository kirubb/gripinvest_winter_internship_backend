import React, { useState, useEffect, useMemo } from 'react'
import apiClient from '../api'
import Navbar from '../components/Navbar'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function DashboardPage({ onLogout }) {
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

  const portfolioStats = useMemo(() => {
    if (portfolio.length === 0) {
      return { totalValue: 0, investmentCount: 0, riskData: [] }
    }

    const totalValue = portfolio.reduce((sum, item) => sum + parseFloat(item.amount), 0)
    const investmentCount = portfolio.length

    const riskGroups = portfolio.reduce((groups, item) => {
      const key = item.risk_level
      if (!groups[key]) {
        groups[key] = 0
      }
      groups[key] += parseFloat(item.amount)
      return groups
    }, {})

    const riskData = Object.entries(riskGroups).map(([name, value]) => ({ name, value }))
    
    return { totalValue, investmentCount, riskData }
  }, [portfolio])

  const COLORS = { low: '#22c55e', moderate: '#3b82f6', high: '#ef4444' };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar onLogout={onLogout} />
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-gray-400 text-sm font-bold">TOTAL VALUE</h2>
                <p className="text-3xl font-semibold">${portfolioStats.totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-gray-400 text-sm font-bold">INVESTMENTS COUNT</h2>
                <p className="text-3xl font-semibold">{portfolioStats.investmentCount}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Portfolio List</h2>
            {loading ? <p>Loading...</p> : portfolio.length > 0 ? (
              <ul className="space-y-4">
                {portfolio.map((investment) => (
                  <li key={investment.id} className="border-b border-gray-700 pb-4 flex justify-between items-center">
                    <div>
                      <span className="font-bold block">{investment.product_name}</span>
                      <span className="text-sm text-gray-400">Invested: {new Date(investment.invested_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">${parseFloat(investment.amount).toFixed(2)}</span>
                      <span className="text-xs text-green-400 block">+{parseFloat(investment.expected_return).toFixed(2)} return</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>You have no investments yet.</p>}
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={portfolioStats.riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {portfolioStats.riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage