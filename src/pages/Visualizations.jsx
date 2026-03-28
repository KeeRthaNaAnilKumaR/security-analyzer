import React, { useState, useEffect } from 'react';
import './Visualizations.css';

const Visualizations = () => {
  const [logs, setLogs] = useState(JSON.parse(localStorage.getItem('saved_logs')) || []);
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('saved_events')) || []);
  const [loading, setLoading] = useState(logs.length === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, eventsRes] = await Promise.all([
          fetch('http://localhost:3001/api/logs'),
          fetch('http://localhost:3001/api/events')
        ]);
        const logsData = await logsRes.json();
        const eventsData = await eventsRes.json();

        if (logsData.length > 0) {
          setLogs(logsData);
          localStorage.setItem('saved_logs', JSON.stringify(logsData));
        }
        if (eventsData.length > 0) {
          setEvents(eventsData);
          localStorage.setItem('saved_events', JSON.stringify(eventsData));
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC ---
  const statusCounts = logs.reduce((acc, log) => {
    const code = log.status_code || 'Unknown';
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {});

  const statusCodes = Object.entries(statusCounts).map(([code, count]) => ({
    code,
    count,
    color: code.startsWith('2') ? '#10b981' : code.startsWith('4') ? '#f59e0b' : '#ef4444'
  }));
  const maxCount = Math.max(...statusCodes.map(s => s.count), 1);

  const threatCounts = events.reduce((acc, event) => {
    const type = event.event_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // C. SVG Pie Chart Math & Fixed Categories
  const totalThreats = events.length || 0;
  const threatColorMap = {
    "SQL Injection Attempt": "#ef4444",
    "XSS Attempt": "#f59e0b",
    "Suspicious Path": "#3b82f6",
    "Unknown": "#8b5cf6"
  };

  // Ensure all categories exist even if count is 0
  const finalPieData = Object.keys(threatColorMap).map(term => {
    const count = threatCounts[term] || 0;
    const percentage = totalThreats > 0 ? Math.round((count / totalThreats) * 100) : 0;
    return { term, count, percentage, color: threatColorMap[term] };
  });

  // Filter for SVG drawing (only slices > 0)
  const chartSlices = finalPieData.filter(d => d.count > 0);

  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (loading) return <div className="loading">Generating Security Visualizations...</div>;

  return (
    <div className="viz-container fade-in">
      <div className="page-header">
        <h2>Data Visualizations</h2>
        <p className="text-secondary">Interactive analysis of {logs.length} total logs</p>
      </div>

      <div className="viz-grid">
        {/* Status Chart */}
        <div className="viz-card">
          <h3>HTTP Status Code Distribution</h3>
          <div className="bar-chart">
            {statusCodes.map((status) => (
              <div key={status.code} className="bar-item">
                <div className="bar-label">{status.code}</div>
                <div className="bar-wrapper">
                  <div className="bar-fill" style={{ width: `${(status.count / maxCount) * 100}%`, background: status.color }}>
                    <span className="bar-value">{status.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improved Doughnut Chart */}
        <div className="viz-card">
          <h3>Threat Type Distribution</h3>
          <div className="pie-chart-container">
            <div className="svg-pie-wrapper">
              <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }}>
                {chartSlices.map((slice, i) => {
                  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                  cumulativePercent += slice.percentage / 100;
                  const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                  const largeArcFlag = slice.percentage / 100 > 0.5 ? 1 : 0;
                  const pathData = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L 0 0`,
                  ].join(' ');

                  return (
                    <path key={i} d={pathData} fill={slice.color} className="pie-slice">
                      <title>{`${slice.term}: ${slice.percentage}%`}</title>
                    </path>
                  );
                })}
              </svg>
              <div className="pie-center-label">
                <span className="total-num">{events.length}</span>
                <span className="total-text">Threats</span>
              </div>
            </div>

            <div className="pie-legend">
              {finalPieData.map((slice, i) => (
                <div key={i} className="legend-item highlight-on-hover">
                  <span className="legend-color" style={{ background: slice.color }}></span>
                  <div className="legend-info">
                    <span className="legend-term">{slice.term}</span>
                    <span className="legend-count">{slice.count} incidents ({slice.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Word Cloud */}
        <div className="viz-card full-width">
          <h3>Detected Threat Frequency (Word Cloud)</h3>
          <div className="word-cloud">
            {Object.entries(threatCounts).map(([term, count], index) => (
              <span key={index} className="word-cloud-item" style={{ fontSize: `${Math.min(3, 1 + (count / 10))}rem` }}>
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;