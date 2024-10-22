import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ImageFeed, ImageWorkshop } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageWorkshop />} />
        <Route path="/feed" element={<ImageFeed />} />
      </Routes>
    </Router>
  )
}

export default App
