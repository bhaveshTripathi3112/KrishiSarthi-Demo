import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'

export default function App() {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup']; // Add paths where header should be hidden
  
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <Outlet />
      
    </div>
  );
}