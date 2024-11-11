import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {
  ImageFeed,
  ImageWorkshop,
  Admin,
  Questionnaire,
  Admin_home
} from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ImageWorkshop />} />
        <Route path='/feed' element={<ImageFeed />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/questionnaire' element={<Questionnaire />} />
        <Route path='/admin_home' element={<Admin_home />} />
      </Routes>
    </Router>
  )
}

export default App
