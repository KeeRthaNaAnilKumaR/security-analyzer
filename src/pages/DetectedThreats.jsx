import React, { useState, useEffect } from 'react';
import './DetectedThreats.css';

const DetectedThreats = () => {
  const [threats, setThreats] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch live data from your SQL Server via Node.js
  useEffect(() => {
    fetch('http://localhost:3001/api/events') // Ensure this route exists in server.js
      .then((res) => res.json())
      .then((data) => {
        setThreats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  // 2. Dynamic statistics based on live data
  const counts = {
    high: threats.filter(t => t.security_level?.toLowerCase() === 'high').length,
    medium: threats.filter(t => t.security_level?.toLowerCase() === 'medium').length,
    low: threats.filter(t => t.security_level?.toLowerCase() === 'low').length,
  };

  const filteredThreats = threats.filter(threat => {
    const severity = threat.security_level?.toLowerCase() || '';
    const type = threat.event_type?.toLowerCase() || '';
    const ip = threat.ip_address || '';

    const matchesFilter = filter === 'all' || severity === filter;
    const matchesSearch = ip.includes(searchTerm) || type.includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="loading">Connecting to Security Database...</div>;

  return (
    <div className="threats-container fade-in">
      <div className="threats-header">
        <div>
          <h2>Detected Security Threats</h2>
          <p className="text-secondary">Real-time threat detection from SQL Server</p>
        </div>
        <div className="threat-stats">
          <div className="threat-stat">
            <span className="stat-number high">{counts.high}</span>
            <span className="stat-label">High</span>
          </div>
          <div className="threat-stat">
            <span className="stat-number medium">{counts.medium}</span>
            <span className="stat-label">Medium</span>
          </div>
          <div className="threat-stat">
            <span className="stat-number low">{counts.low}</span>
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
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button 
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Threats' : `${f.charAt(0).toUpperCase() + f.slice(1)} Severity`}
            </button>
          ))}
        </div>
      </div>

      <div className="threats-table-container">
        <table className="threats-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Threat Type</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreats.map((threat, index) => (
              <tr key={threat.event_id || index} style={{ animationDelay: `${index * 0.05}s` }}>
                <td className="timestamp">{new Date(threat.timestamp).toLocaleString()}</td>
                <td className="ip-cell">
                  <code>{threat.ip_address}</code>
                </td>
                <td>
                  <span className="threat-type-badge">{threat.event_type}</span>
                </td>
                <td className="url-cell">
                  <code>{threat.event_description}</code>
                </td>
                <td>
                  <span className={`severity-badge severity-${threat.security_level?.toLowerCase()}`}>
                    {threat.security_level}
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
        {filteredThreats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            No threats detected. Your system is currently secure.
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectedThreats;