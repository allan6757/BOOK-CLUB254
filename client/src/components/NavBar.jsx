import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">B(oo)k Wormz</span>
        </Link>
        

        

        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/my-list" 
              className={`nav-link ${isActive('/my-list') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-text">My Library</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/favorites" 
              className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-text">Favorites</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/friends" 
              className={`nav-link ${isActive('/friends') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-text">Friends</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-text">About</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="nav-item mobile-auth">
              <button 
                onClick={handleLogout}
                className="nav-link"
              >
                <span className="nav-text">Logout</span>
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item mobile-auth">
                <Link 
                  to="/login" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-text">Login</span>
                </Link>
              </li>
              <li className="nav-item mobile-auth">
                <Link 
                  to="/signup" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-text">Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span className="user-info">{user?.username}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-gradient">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;