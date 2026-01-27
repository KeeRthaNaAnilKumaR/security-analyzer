import React from 'react';
import './IPAnalysis.css';

const IPAnalysis = () => {
  const topIPs = [
    { ip: '192.168.1.105', requests: 2847, suspicious: true, country: 'Unknown', lastSeen: '2026-01-27 14:32', userAgent: 'Python/3.9' },
    { ip: '203.45.67.89', requests: 1234, suspicious: true, country: 'China', lastSeen: '2026-01-27 14:28', userAgent: 'curl/7.68.0' },
    { ip: '10.0.0.234', requests: 987, suspicious: false, country: 'US', lastSeen: '2026-01-27 14:15', userAgent: 'Chrome/120.0' },
    { ip: '172.16.0.88', requests: 756, suspicious: false, country: 'UK', lastSeen: '2026-01-27 14:02', userAgent: 'Firefox/121.0' },
    { ip: '45.67.89.123', requests: 642, suspicious: true, country: 'Russia', lastSeen: '2026-01-27 13:30', userAgent: 'Bot/1.0' },
  ];

  return (
    <div className="ip-analysis-container fade-in">
      <div className="page-header">
        <h2>IP Address Analysis</h2>
        <p className="text-secondary">Detailed analysis of traffic sources and patterns</p>
      </div>

      <div className="ip-stats-grid">
        <div className="ip-stat-card">
          <div className="ip-stat-icon">🌐</div>
          <div className="ip-stat-value">1,847</div>
          <div className="ip-stat-label">Total Unique IPs</div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon">⚠️</div>
          <div className="ip-stat-value">127</div>
          <div className="ip-stat-label">Suspicious IPs</div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon">🤖</div>
          <div className="ip-stat-value">45</div>
          <div className="ip-stat-label">Bot IPs Detected</div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon">🚫</div>
          <div className="ip-stat-value">23</div>
          <div className="ip-stat-label">Blocked IPs</div>
        </div>
      </div>

      <div className="ip-table-section">
        <div className="section-header">
          <h3>Top IP Addresses by Request Count</h3>
          <button className="export-btn">📥 Export CSV</button>
        </div>
        <div className="ip-table-container">
          <table className="ip-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Total Requests</th>
                <th>Country</th>
                <th>User Agent</th>
                <th>Last Seen</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topIPs.map((item, index) => (
                <tr key={index}>
                  <td>
                    <code className="ip-code">{item.ip}</code>
                  </td>
                  <td><strong>{item.requests.toLocaleString()}</strong></td>
                  <td>{item.country}</td>
                  <td><code className="agent-code">{item.userAgent}</code></td>
                  <td className="timestamp">{item.lastSeen}</td>
                  <td>
                    <span className={`status-badge ${item.suspicious ? 'suspicious' : 'normal'}`}>
                      {item.suspicious ? '⚠️ Suspicious' : '✓ Normal'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn-small">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IPAnalysis;