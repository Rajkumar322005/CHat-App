import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage' 
import ProfilePage from './pages/ProfilePage'

const App
 = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
