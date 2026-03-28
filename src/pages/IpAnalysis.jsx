import React, { useState, useEffect } from 'react';
import './IPAnalysis.css';

const IPAnalysis = () => {
  const [ipData, setIpData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/logs')
      .then((res) => res.json())
      .then((logs) => {
        const grouped = logs.reduce((acc, log) => {
          if (!acc[log.ip_address]) {
            acc[log.ip_address] = {
              ip: log.ip_address,
              requests: 0,
              suspicious: false,
              lastSeen: log.timestamp,
            };
          }
          acc[log.ip_address].requests += 1;
          if (log.security_level === 'High') {
            acc[log.ip_address].suspicious = true;
          }
          if (new Date(log.timestamp) > new Date(acc[log.ip_address].lastSeen)) {
            acc[log.ip_address].lastSeen = log.timestamp;
          }
          return acc;
        }, {});

        setIpData(Object.values(grouped).sort((a, b) => b.requests - a.requests));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching IP analysis:", err);
        setLoading(false);
      });
  }, []);

  // --- NEW: CSV DOWNLOAD LOGIC ---
  const downloadCSV = () => {
    if (ipData.length === 0) return;

    // Define Headers
    const headers = ["IP Address", "Total Requests", "Last Seen", "Status"];
    
    // Map data to rows
    const rows = ipData.map(item => [
      item.ip,
      item.requests,
      new Date(item.lastSeen).toLocaleString(),
      item.suspicious ? "Suspicious" : "Normal"
    ]);

    // Combine headers and rows into a string
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `IP_Analysis_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    totalUnique: ipData.length,
    suspicious: ipData.filter(item => item.suspicious).length,
    totalRequests: ipData.reduce((sum, item) => sum + item.requests, 0)
  };

  if (loading) return <div className="loading">Analyzing Traffic Patterns...</div>;

  return (
    <div className="ip-analysis-container fade-in">
      <div className="page-header">
        <h2>IP Address Analysis</h2>
        <p className="text-secondary">Live analysis of traffic sources from SQL Server</p>
      </div>

      <div className="ip-stats-grid">
        <div className="ip-stat-card">
          <div className="ip-stat-icon">🌐</div>
          <div className="ip-stat-value">{stats.totalUnique.toLocaleString()}</div>
          <div className="ip-stat-label">Total Unique IPs</div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon">⚠️</div>
          <div className="ip-stat-value">{stats.suspicious}</div>
          <div className="ip-stat-label">Suspicious IPs</div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon">📊</div>
          <div className="ip-stat-value">{stats.totalRequests.toLocaleString()}</div>
          <div className="ip-stat-label">Total Requests Analyzed</div>
        </div>
      </div>

      <div className="ip-table-section">
        <div className="section-header">
          <h3>Top IP Addresses by Request Count</h3>
          {/* Attached downloadCSV to this button */}
          <button className="export-btn" onClick={downloadCSV}>📥 Export CSV</button>
        </div>
        <div className="ip-table-container">
          <table className="ip-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Total Requests</th>
                <th>Last Seen</th>
                <th>Status</th>
                {/* Details column header removed */}
              </tr>
            </thead>
            <tbody>
              {ipData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <code className="ip-code">{item.ip}</code>
                  </td>
                  <td><strong>{item.requests.toLocaleString()}</strong></td>
                  <td className="timestamp">{new Date(item.lastSeen).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${item.suspicious ? 'suspicious' : 'normal'}`}>
                      {item.suspicious ? '⚠️ Suspicious' : '✓ Normal'}
                    </span>
                  </td>
                  {/* Details column cell removed */}
                </tr>
              ))}
            </tbody>
          </table>
          {ipData.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>No IP data found.</p>}
        </div>
      </div>
    </div>
  );
};

export default IPAnalysis;