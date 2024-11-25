import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeedDetail, ImageFeed, ImageWorkshop, MeetTheCharacters, UserParticulars, UserPreferences, Welcome, Admin, Questionnaire, Admin_home } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user-details" element={<UserParticulars engagementId={'5920582525'} />} />
        <Route path="/user-preferences" element={<UserPreferences engagementId={'5920582525'} />} />
        <Route path="/meet-characters" element={<MeetTheCharacters />} />
        <Route path="/image-workshop" element={<ImageWorkshop />} />
        <Route path="/feed" element={<ImageFeed engagementId={'5920582525'} />} />
        <Route path="/feed/:id" element={<FeedDetail />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/questionnaire' element={<Questionnaire />} />
        <Route path='/admin_home' element={<Admin_home engagementId={'3d226ca1-fcb8-4d78-b8ad-fc3aa224c9d6'} />} />
      </Routes>
    </Router>
  )
}

export default App
