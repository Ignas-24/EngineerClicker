import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AlertProvider } from "./components/BottomLeft/PopUp/AlertProvider.jsx";

createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <App />
  </AlertProvider>
)
