import React from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage, username, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'upload', label: 'Log Upload', icon: '📂' },
    { id: 'threats', label: 'Detected Threats', icon: '🚨' },
    { id: 'ip-analysis', label: 'IP Analysis', icon: '🌐' },
    { id: 'visualizations', label: 'Visualizations', icon: '📈' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">🔐</div>
          <div className="brand-text">
            <h1 className="brand-title">Security Log Analyzer</h1>
            <p className="brand-subtitle">NLP-Powered Threat Detection</p>
          </div>
        </div>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <span className="user-name">{username}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;