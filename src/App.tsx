import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { ImageFeed, ImageWorkshop, Admin, Questionnaire } from './features'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageWorkshop />} />
        <Route path="/feed" element={<ImageFeed />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </Router>
  )
}

export default App
