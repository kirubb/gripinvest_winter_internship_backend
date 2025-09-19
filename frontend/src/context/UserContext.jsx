import React, { createContext, useState, useContext, useEffect } from 'react'
import apiClient from '../api'

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await apiClient.get('/user/profile')
        setUser(response.data)
      } catch (error) {
        console.error('Failed to fetch user profile', error)
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const updateUser = (newUserData) => {
    setUser(newUserData)
  }

  const value = { user, loading, fetchUser, updateUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}