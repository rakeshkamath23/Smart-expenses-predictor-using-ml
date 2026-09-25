import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
