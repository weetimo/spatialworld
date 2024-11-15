import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeedDetail, ImageFeed, ImageWorkshop, StartImageWorkshop, UserParticulars, UserPreferences, Welcome } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user-details" element={<UserParticulars />} />
        <Route path="/user-preferences" element={<UserPreferences />} />
        <Route path="/start-workshop" element={<StartImageWorkshop />} />
        <Route path="/image-workshop" element={<ImageWorkshop />} />
        <Route path="/feed" element={<ImageFeed />} />
        <Route path="/feed/:id" element={<FeedDetail />} />
      </Routes>
    </Router>
  )
}

export default App
