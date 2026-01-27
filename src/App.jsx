import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogUpload from './pages/LogUpload';
import DetectedThreats from './pages/DetectedThreats';
import IPAnalysis from './pages/IpAnalysis';
import Visualizations from './pages/Visualizations';
import './styles/global.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <LogUpload />;
      case 'threats':
        return <DetectedThreats />;
      case 'ip-analysis':
        return <IPAnalysis />;
      case 'visualizations':
        return <Visualizations />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
return (
  <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* This is your fixed left sidebar navigation */}
    <Navbar
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      username={username}
      onLogout={handleLogout}
    />
    
    <div className="content-wrapper" style={{ flex: 1 }}>
      <main className="main-content p-6">
        {renderPage()}
      </main>
    </div>
  </div>
);
}

export default App;