
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminPreview from './AdminPreview.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

const currentPath = window.location.pathname

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {currentPath === '/admin/login' ? (
  <AdminLogin />
) : currentPath === '/admin' ? (
  <AdminPreview />
) : (
  <App />
)}
  </StrictMode>
)
