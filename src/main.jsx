import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Tailwind base styles
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
