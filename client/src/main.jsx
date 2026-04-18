import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { GlobalErrorBoundary } from './components/ErrorBoundary'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
)
