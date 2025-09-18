import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api'
import Navbar from '../components/Navbar'

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${productId}`)
        setProduct(response.data)
      } catch (err) {
        setError('Failed to fetch product details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleInvestment = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await apiClient.post('/investments', {
        productId: productId,
        amount: parseFloat(amount),
      })
      setSuccess('Investment successful! Redirecting to dashboard...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Investment failed.')
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>
  if (error && !product) return <div className="min-h-screen bg-gray-900 text-white p-8">{error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        {product && (
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-400 mb-6">{product.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Annual Yield</div>
                <div className="text-2xl font-bold text-green-400">{product.annual_yield}%</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Risk Level</div>
                <div className="text-2xl font-bold capitalize">{product.risk_level}</div>
              </div>
            </div>

            <form onSubmit={handleInvestment} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold mb-4">Make an Investment</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <label htmlFor="amount" className="block text-sm font-bold mb-2">Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: $${product.min_investment}`}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Invest Now
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage