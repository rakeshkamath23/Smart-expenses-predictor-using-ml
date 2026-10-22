import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const location = useLocation();
  const isAuth = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/opening';

  // Always reset scroll position to top synchronously before the browser paints the new route
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="app-container">
      {!isAuth && <Navbar />}
      <main className={isAuth ? 'auth-viewport-content' : 'main-content'}>
        <AppRoutes />
      </main>
      {!isAuth && <Footer />}
    </div>
  );
}
