import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')
console.log('Root element found:', !!root)

if (!root) {
  console.error('Root element not found')
} else {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('App rendered successfully')
  } catch (error) {
    console.error('Error rendering app:', error)
  }
}
