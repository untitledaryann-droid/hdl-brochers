import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminPanel from './components/AdminPanel.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminPanel />
  </StrictMode>,
)
