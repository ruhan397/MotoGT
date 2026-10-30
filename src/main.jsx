
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminPreview from './AdminPreview.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPreview />
  </StrictMode>,
)
