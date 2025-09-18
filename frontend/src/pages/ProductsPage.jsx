import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // This line was missing
import apiClient from '../api'
import Navbar from '../components/Navbar'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>
  if (error) return <div className="min-h-screen bg-gray-900 text-white p-8">{error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <h1 className="text-3xl font-bold mb-6">Investment Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 h-full">
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