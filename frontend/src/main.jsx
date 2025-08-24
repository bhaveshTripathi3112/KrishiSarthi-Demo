import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import { Home } from './components/Home/Home'
import { Login } from './components/Login/Login'
import { Signup } from './components/Signup/Signup'
import { Scanner } from './components/PlantDisease/Scanner'
import { Contact } from './components/Contacts/Contacts'
import { About } from './components/About/About'
import UserContext from './contexts/UserContext'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="scanner" element={<Scanner />} />
      <Route path="contact" element={<Contact />} />
      <Route path="about" element={<About />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <RouterProvider router={router} />
    
  </StrictMode>
)