import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './layout.jsx'
import { Home } from './components/index.js'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<Layout/>} >
      <Route path='' element={<Home/>} />
    </Route> 
  )
)
createRoot(document.getElementById('root')).render(
  <RouterProvider router ={router}/>
)
