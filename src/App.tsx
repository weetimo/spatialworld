import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ImageWorkshop } from './features'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageWorkshop />} />
      </Routes>
    </Router>
  )
}

export default App
