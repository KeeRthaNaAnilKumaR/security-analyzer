import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // Demo credentials
    if (username === 'admin' && password === 'admin') {
      setTimeout(() => {
        onLogin(username);
        setLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        setError('Invalid credentials. Use admin/admin');
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="grid-pattern"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">Security Log Analyzer</h1>
          <p className="login-subtitle">NLP-Powered Threat Detection System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Login to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Demo Credentials:</strong> admin / admin
          </p>
          <p className="login-note">
            Administrator access only • Offline analysis tool
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;