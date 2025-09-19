import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api'
import Navbar from '../components/Navbar'

function ProductsPage({ onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products')
        setProducts(response.data)
      } catch (err) {
        setError('Failed to fetch products.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') {
      return products
    }
    return products.filter((product) => product.risk_level === activeFilter)
  }, [products, activeFilter])

  const FilterButton = ({ filterType, children }) => (
    <button
      onClick={() => setActiveFilter(filterType)}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
        activeFilter === filterType
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  )

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>
  if (error) return <div className="min-h-screen bg-gray-900 text-white p-8">{error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar onLogout={onLogout} />
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Investment Products</h1>
            <div className="flex items-center space-x-2">
                <FilterButton filterType="all">All</FilterButton>
                <FilterButton filterType="low">Low Risk</FilterButton>
                <FilterButton filterType="moderate">Moderate Risk</FilterButton>
                <FilterButton filterType="high">High Risk</FilterButton>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 h-full">
                <h2 className="text-xl font-bold text-indigo-400">{product.name}</h2>
                <p className="mt-2">Yield: <span className="font-semibold">{product.annual_yield}%</span></p>
                <p>Tenure: <span className="font-semibold">{product.tenure_months} months</span></p>
                <p>Risk: <span className="font-semibold capitalize">{product.risk_level}</span></p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage