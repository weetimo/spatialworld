import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeedDetail, ImageFeed, ImageWorkshop, MeetTheCharacters, UserParticulars, UserPreferences, Welcome, Admin, Admin_home } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user-details" element={<UserParticulars engagementId={'e0d2d314-3512-49d6-9fb9-6a27cfc384ad'} />} />
        <Route path="/user-preferences" element={<UserPreferences engagementId={'e0d2d314-3512-49d6-9fb9-6a27cfc384ad'} />} />
        <Route path="/meet-characters" element={<MeetTheCharacters />} />
        <Route path="/image-workshop" element={<ImageWorkshop />} />
        <Route path="/feed" element={<ImageFeed engagementId={'e0d2d314-3512-49d6-9fb9-6a27cfc384ad'} />} />
        <Route path="/feed/:id" element={<FeedDetail />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin_home/:id' element={<Admin_home />} />
      </Routes>
    </Router>
  )
}

export default App
