import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Log Entries',
      value: '24,531',
      change: '+12.5%',
      icon: '📝',
      color: 'blue'
    },
    {
      title: 'Unique IP Addresses',
      value: '1,847',
      change: '+8.2%',
      icon: '🌐',
      color: 'purple'
    },
    {
      title: 'Suspicious Events',
      value: '342',
      change: '-5.3%',
      icon: '⚠️',
      color: 'orange'
    },
    {
      title: 'High-Severity Alerts',
      value: '23',
      change: '-15.4%',
      icon: '🚨',
      color: 'red'
    }
  ];

  const recentEvents = [
    {
      id: 1,
      timestamp: '2026-01-27 14:32:15',
      ip: '192.168.1.105',
      event: 'SQL Injection Attempt',
      url: '/admin/login.php?id=1\' OR \'1\'=\'1',
      severity: 'High'
    },
    {
      id: 2,
      timestamp: '2026-01-27 14:28:42',
      ip: '203.45.67.89',
      event: 'Brute Force Attack',
      url: '/wp-login.php',
      severity: 'High'
    },
    {
      id: 3,
      timestamp: '2026-01-27 14:15:33',
      ip: '10.0.0.234',
      event: 'Directory Traversal',
      url: '/files/../../etc/passwd',
      severity: 'Medium'
    },
    {
      id: 4,
      timestamp: '2026-01-27 14:02:18',
      ip: '172.16.0.88',
      event: 'XSS Attempt Detected',
      url: '/search?q=<script>alert(1)</script>',
      severity: 'Medium'
    },
    {
      id: 5,
      timestamp: '2026-01-27 13:45:09',
      ip: '192.168.5.12',
      event: 'Unusual User-Agent',
      url: '/api/users',
      severity: 'Low'
    }
  ];

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
          <div 
            key={index} 
            className={`stat-card stat-${stat.color}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change.startsWith('+') ? '↗' : '↘'} {stat.change} from last week
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Request Volume Over Time</h3>
          <select className="time-filter">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="chart-container">
          <div className="chart-placeholder">
            <div className="chart-bars">
              {[65, 45, 75, 55, 85, 50, 90, 70, 60, 80, 55, 95].map((height, i) => (
                <div 
                  key={i} 
                  className="chart-bar"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <div className="bar-tooltip">{Math.floor(height * 30)} requests</div>
                </div>
              ))}
            </div>
            <div className="chart-labels">
              {['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Security Events</h3>
          <button className="view-all-btn">View All →</button>
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
              {recentEvents.map((event) => (
                <tr key={event.id}>
                  <td className="timestamp">{event.timestamp}</td>
                  <td className="ip-address">
                    <code>{event.ip}</code>
                  </td>
                  <td className="event-type">
                    <span className="event-badge">{event.event}</span>
                  </td>
                  <td className="url">
                    <code className="url-text">{event.url}</code>
                  </td>
                  <td>
                    <span className={`severity-badge severity-${event.severity.toLowerCase()}`}>
                      {event.severity}
                    </span>
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

export default Dashboard;