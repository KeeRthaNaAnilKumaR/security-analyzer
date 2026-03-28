import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from your Node.js backend
  useEffect(() => {
    fetch('http://localhost:3001/api/logs') // Ensure this matches your server.js route
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(setLoading(false));
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  // Calculate stats dynamically from the database data
  const stats = [
    {
      title: 'Total Log Entries',
      value: data.length.toLocaleString(),
      icon: '📝',
      color: 'blue'
    },
    {
      title: 'Unique IP Addresses',
      value: [...new Set(data.map(item => item.ip_address))].length,
      icon: '🌐',
      color: 'purple'
    },
    {
      title: 'High-Severity Alerts',
      value: data.filter(item => item.security_level === 'High').length,
      icon: '🚨',
      color: 'red'
    }
  ];

  if (loading) return <div className="loading">Loading Security Data...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="text-secondary">Real-time security monitoring and analysis</p>
        </div>
        <div className="last-updated">
          <span className="status-dot"></span>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Security Events Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Security Events (From SQL Server)</h3>
        </div>
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Event Type</th>
                <th>Request URL</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((log, index) => (
                <tr key={index}>
                  <td className="timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="ip-address"><code>{log.ip_address}</code></td>
                  <td className="event-type">
                    <span className="event-badge">{log.event_type}</span>
                  </td>
                  <td className="url"><code className="url-text">{log.req_url}</code></td>
                  <td>
                    <span className={`severity-badge severity-${log.security_level?.toLowerCase()}`}>
                      {log.security_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>No data found. Run analyzer.py to populate logs.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;