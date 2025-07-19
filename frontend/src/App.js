import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CitizenForm from './components/CitizenForm';
import ComplaintTracking from './components/ComplaintTracking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    // Check if admin is already logged in
    return localStorage.getItem('adminToken') !== null;
  });

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  // basename for GitHub Pages
  const basename = process.env.NODE_ENV === 'production' ? '' : '';

  return (
    <Router basename={basename}>
      <div className="App">
        <Navbar 
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminLogout={handleAdminLogout}
        />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<CitizenForm />} />
            <Route path="/track" element={<ComplaintTracking />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                isAdminLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAdminLoggedIn ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin" replace />
                )
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
