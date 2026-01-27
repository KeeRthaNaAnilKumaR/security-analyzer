import React, { useState } from 'react';
import './DetectedThreats.css';

const DetectedThreats = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const threats = [
    { id: 1, timestamp: '2026-01-27 14:32:15', ip: '192.168.1.105', url: '/admin/login.php?id=1\' OR \'1\'=\'1', type: 'SQL Injection', severity: 'High', status: 'Blocked' },
    { id: 2, timestamp: '2026-01-27 14:28:42', ip: '203.45.67.89', url: '/wp-login.php', type: 'Brute Force', severity: 'High', status: 'Blocked' },
    { id: 3, timestamp: '2026-01-27 14:15:33', ip: '10.0.0.234', url: '/files/../../etc/passwd', type: 'Directory Traversal', severity: 'Medium', status: 'Blocked' },
    { id: 4, timestamp: '2026-01-27 14:02:18', ip: '172.16.0.88', url: '/search?q=<script>alert(1)</script>', type: 'XSS Attempt', severity: 'Medium', status: 'Blocked' },
    { id: 5, timestamp: '2026-01-27 13:45:09', ip: '192.168.5.12', url: '/api/users', type: 'Suspicious Agent', severity: 'Low', status: 'Logged' },
    { id: 6, timestamp: '2026-01-27 13:30:45', ip: '45.67.89.123', url: '/admin/config.php', type: 'Unauthorized Access', severity: 'High', status: 'Blocked' },
    { id: 7, timestamp: '2026-01-27 13:15:22', ip: '198.51.100.42', url: '/upload.php?file=shell.php', type: 'File Upload Attack', severity: 'High', status: 'Blocked' },
    { id: 8, timestamp: '2026-01-27 13:00:11', ip: '172.16.0.99', url: '/index.php?page=../../../../etc/passwd', type: 'LFI Attempt', severity: 'Medium', status: 'Blocked' },
  ];

  const filteredThreats = threats.filter(threat => {
    const matchesFilter = filter === 'all' || threat.severity.toLowerCase() === filter;
    const matchesSearch = threat.ip.includes(searchTerm) || threat.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="threats-container fade-in">
      <div className="threats-header">
        <div>
          <h2>Detected Security Threats</h2>
          <p className="text-secondary">Real-time threat detection and analysis</p>
        </div>
        <div className="threat-stats">
          <div className="threat-stat">
            <span className="stat-number high">23</span>
            <span className="stat-label">High</span>
          </div>
          <div className="threat-stat">
            <span className="stat-number medium">45</span>
            <span className="stat-label">Medium</span>
          </div>
          <div className="threat-stat">
            <span className="stat-number low">78</span>
            <span className="stat-label">Low</span>
          </div>
        </div>
      </div>

      <div className="threats-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by IP or threat type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Threats
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Severity
          </button>
          <button 
            className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button 
            className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low
          </button>
        </div>
      </div>

      <div className="threats-table-container">
        <table className="threats-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Threat Type</th>
              <th>Request URL</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreats.map((threat, index) => (
              <tr key={threat.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <td className="timestamp">{threat.timestamp}</td>
                <td className="ip-cell">
                  <code>{threat.ip}</code>
                </td>
                <td>
                  <span className="threat-type-badge">{threat.type}</span>
                </td>
                <td className="url-cell">
                  <code>{threat.url}</code>
                </td>
                <td>
                  <span className={`severity-badge severity-${threat.severity.toLowerCase()}`}>
                    {threat.severity}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${threat.status.toLowerCase()}`}>
                    {threat.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-icon" title="View Details">👁️</button>
                  <button className="action-icon" title="Block IP">🚫</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetectedThreats;