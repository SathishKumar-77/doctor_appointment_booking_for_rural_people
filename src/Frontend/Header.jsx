// Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { 
  FaHome, 
  FaUserPlus, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaCalendarPlus, 
  FaUserMd, 
  FaCog,
  FaBars,
  FaUserCircle 
} from 'react-icons/fa';
import '../style/Header.css';

const Header = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const sessionData = {
        user,
        expiry: new Date().getTime() + 60 * 60 * 1000 // 1 hour from now
      };
      sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    }
  }, [isAuthenticated, user]);



  React.useEffect(() => {
    if (isAuthenticated && user) {
      axios.post('http://localhost:5000/api/auth', {
        auth0Id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      }).then(response => {
        const userRole = response.data.user.role || 'user';
        setRole(userRole);
        localStorage.setItem('user', user);
        // We'll handle role-based logic in the render
      }).catch(error => {
        console.error('Error storing user:', error);
      });
    }
  }, [isAuthenticated, user]);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  const getDefaultAvatar = (name) => {
    const initial = getInitial(name);
    return (
      <div className="avatar-default">
        {initial}
      </div>
    );
  };

  return (
    <header className="header-container">
      <nav className="nav-bar">
        <div className="nav-content">
          <Link className="nav-brand" to="/">Rural Healthcare</Link>
          <button
            className="nav-toggle"
            onClick={handleNavCollapse}
            aria-label="Toggle navigation"
          >
            <FaBars />
          </button>
          <div className={`nav-menu ${isNavCollapsed ? 'collapsed' : 'expanded'}`}>
            <ul className="nav-list">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FaHome /> Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-button" onClick={() => loginWithRedirect()}>
                      <FaSignInAlt /> Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-button" 
                      onClick={() => loginWithRedirect({
                        authorizationParams: { screen_hint: 'signup' }
                      })}
                    >
                      <FaUserPlus /> Register
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {role === 'Admin' ? (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/">
                          <FaHome /> Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/doctor-form">
                          <FaUserMd /> Add Doctors
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/appointment-handle">
                          <FaCog /> Manage Appointments
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/">
                          <FaHome /> Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/book-appointment">
                          <FaCalendarPlus /> Book Appointment
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/appointments">
                          <FaUserMd /> Your Appointments
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item user-info">
                    <div className="user-profile">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="user-avatar"
                        />
                      ) : (
                        getDefaultAvatar(user.name)
                      )}
                      <span className="user-name">
                        Welcome, {user?.name || 'User'}
                      </span>
                    </div>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-button logout-btn" 
                      onClick={() => logout({ returnTo: window.location.origin })}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;