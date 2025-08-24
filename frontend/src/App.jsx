import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import UserContext from './contexts/UserContext';
import Footer from './components/Footer/Footer';
export default function App() {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup']; // Add paths where header should be hidden
  
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <UserContext>
        <Outlet />
        <Footer/>
      </UserContext>
      
    </div>
  );
}