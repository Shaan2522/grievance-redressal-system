import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAdminLoggedIn, onAdminLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Grievance Redressal Portal</h2>
          <p>शिकायत निवारण पोर्टल</p>
        </Link>
        
        <div className="nav-links">          
          <Link 
            to="/submit" 
            className={location.pathname === '/submit' ? 'active' : ''}
          >
            Submit Complaint
          </Link>
          
          <Link 
            to="/track" 
            className={location.pathname === '/track' ? 'active' : ''}
          >
            Track Complaint
          </Link>
          
          {!isAdminLoggedIn ? (
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Login
            </Link>
          ) : (
            <div className="admin-section">
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Dashboard
              </Link>
              <button onClick={onAdminLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
