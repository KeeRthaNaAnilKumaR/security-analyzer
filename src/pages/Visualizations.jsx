import React from 'react';
import './Visualizations.css';

const Visualizations = () => {
  const statusCodes = [
    { code: '200', count: 18234, color: '#10b981' },
    { code: '404', count: 3421, color: '#f59e0b' },
    { code: '500', count: 876, color: '#ef4444' },
    { code: '403', count: 1245, color: '#8b5cf6' },
    { code: '301', count: 2156, color: '#3b82f6' }
  ];

  const maxCount = Math.max(...statusCodes.map(s => s.count));

  const securityTerms = [
    { term: 'SQL Injection', size: 3, count: 145 },
    { term: 'XSS', size: 2.5, count: 98 },
    { term: 'CSRF', size: 1.8, count: 67 },
    { term: 'Brute Force', size: 2.8, count: 112 },
    { term: 'Directory Traversal', size: 2.2, count: 82 },
    { term: 'DDoS', size: 1.5, count: 45 },
    { term: 'Bot', size: 2.6, count: 104 },
    { term: 'Malware', size: 1.7, count: 56 },
  ];

  return (
    <div className="viz-container fade-in">
      <div className="page-header">
        <h2>Data Visualizations</h2>
        <p className="text-secondary">Interactive charts and analysis</p>
      </div>

      <div className="viz-grid">
        {/* HTTP Status Codes */}
        <div className="viz-card">
          <h3>HTTP Status Code Distribution</h3>
          <div className="bar-chart">
            {statusCodes.map((status) => (
              <div key={status.code} className="bar-item">
                <div className="bar-label">{status.code}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(status.count / maxCount) * 100}%`,
                      background: status.color
                    }}
                  >
                    <span className="bar-value">{status.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Over Time */}
        <div className="viz-card">
          <h3>Requests Over Last 24 Hours</h3>
          <div className="line-chart">
            <svg viewBox="0 0 400 200" className="line-svg">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#lineGradient)"
                stroke="var(--primary-accent)"
                strokeWidth="2"
                points="0,150 40,120 80,100 120,130 160,80 200,90 240,70 280,100 320,60 360,80 400,50"
              />
            </svg>
            <div className="chart-labels-x">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Security Terms Word Cloud */}
        <div className="viz-card full-width">
          <h3>Security-Related Terms Frequency</h3>
          <div className="word-cloud">
            {securityTerms.map((term, index) => (
              <span 
                key={index}
                className="word-cloud-item"
                style={{ 
                  fontSize: `${term.size}rem`,
                  animationDelay: `${index * 0.1}s`
                }}
                title={`${term.count} occurrences`}
              >
                {term.term}
              </span>
            ))}
          </div>
        </div>

        {/* Threat Distribution Pie */}
        <div className="viz-card">
          <h3>Threat Type Distribution</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div className="pie-segment seg-1" style={{ '--percentage': 35 }}></div>
              <div className="pie-segment seg-2" style={{ '--percentage': 25 }}></div>
              <div className="pie-segment seg-3" style={{ '--percentage': 20 }}></div>
              <div className="pie-segment seg-4" style={{ '--percentage': 20 }}></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#ef4444' }}></span>
                <span>SQL Injection (35%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#f59e0b' }}></span>
                <span>XSS (25%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#3b82f6' }}></span>
                <span>Brute Force (20%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#8b5cf6' }}></span>
                <span>Other (20%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="viz-card">
          <h3>Top Traffic Sources</h3>
          <div className="traffic-list">
            {['United States', 'China', 'Russia', 'Germany', 'India'].map((country, index) => (
              <div key={index} className="traffic-item">
                <span className="traffic-country">{country}</span>
                <div className="traffic-bar">
                  <div 
                    className="traffic-fill"
                    style={{ width: `${100 - index * 15}%` }}
                  ></div>
                </div>
                <span className="traffic-percent">{100 - index * 15}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;