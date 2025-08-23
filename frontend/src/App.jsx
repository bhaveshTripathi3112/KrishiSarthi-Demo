import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
    </div>
  )
}