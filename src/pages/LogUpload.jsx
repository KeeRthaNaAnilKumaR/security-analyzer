import React, { useState } from 'react';
import './LogUpload.css';

const LogUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.log') || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        alert('Please select a .log or .txt file');
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    setUploadStatus({ type: 'uploading', message: 'Uploading file...' });

    // Simulate upload process
    setTimeout(() => {
      setUploadStatus({ type: 'parsing', message: 'Parsing log entries...' });
      
      setTimeout(() => {
        setUploadStatus({ 
          type: 'success', 
          message: 'Analysis complete!',
          stats: {
            totalEntries: Math.floor(Math.random() * 10000) + 5000,
            threats: Math.floor(Math.random() * 100) + 20,
            uniqueIPs: Math.floor(Math.random() * 500) + 100,
            processingTime: (Math.random() * 3 + 1).toFixed(2)
          }
        });
        setUploading(false);
      }, 2000);
    }, 1500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-container fade-in">
      <div className="upload-header">
        <h2>Log File Upload & Analysis</h2>
        <p className="text-secondary">Upload your web server access logs for security analysis</p>
      </div>

      <div className="upload-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div 
            className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <div className="upload-icon">📂</div>
                <h3>Drag & Drop Your Log File</h3>
                <p>or</p>
                <label htmlFor="file-input" className="upload-button">
                  Browse Files
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".log,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <p className="upload-hint">Supports .log and .txt files (Max 100MB)</p>
              </>
            ) : (
              <>
                <div className="file-preview">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <h4>{file.name}</h4>
                    <p>{formatFileSize(file.size)}</p>
                    <p className="file-date">
                      Added: {new Date().toLocaleString()}
                    </p>
                  </div>
                  <button 
                    className="remove-file-btn"
                    onClick={() => {
                      setFile(null);
                      setUploadStatus(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <button 
                  className="analyze-button"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Upload & Analyze
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus && (
            <div className={`status-message status-${uploadStatus.type}`}>
              {uploadStatus.type === 'uploading' && (
                <>
                  <span className="loading-spinner"></span>
                  <span>{uploadStatus.message}</span>
                </>
              )}
              
              {uploadStatus.type === 'parsing' && (
                <>
                  <span className="loading-spinner"></span>
                  <span>{uploadStatus.message}</span>
                </>
              )}
              
              {uploadStatus.type === 'success' && (
                <>
                  <span>✅</span>
                  <span>{uploadStatus.message}</span>
                </>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {uploadStatus?.type === 'success' && (
            <div className="analysis-results">
              <h3>Analysis Summary</h3>
              <div className="results-grid">
                <div className="result-card">
                  <div className="result-icon">📊</div>
                  <div className="result-value">{uploadStatus.stats.totalEntries.toLocaleString()}</div>
                  <div className="result-label">Log Entries Processed</div>
                </div>
                <div className="result-card">
                  <div className="result-icon">🚨</div>
                  <div className="result-value">{uploadStatus.stats.threats}</div>
                  <div className="result-label">Threats Detected</div>
                </div>
                <div className="result-card">
                  <div className="result-icon">🌐</div>
                  <div className="result-value">{uploadStatus.stats.uniqueIPs}</div>
                  <div className="result-label">Unique IP Addresses</div>
                </div>
                <div className="result-card">
                  <div className="result-icon">⏱️</div>
                  <div className="result-value">{uploadStatus.stats.processingTime}s</div>
                  <div className="result-label">Processing Time</div>
                </div>
              </div>
              <div className="results-actions">
                <button className="action-btn primary">View Threats →</button>
                <button className="action-btn secondary">Download Report</button>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <h3>📋 Supported Log Formats</h3>
          <ul className="format-list">
            <li>
              <strong>Apache Access Logs</strong>
              <code>access.log</code>
            </li>
            <li>
              <strong>Nginx Access Logs</strong>
              <code>access.log</code>
            </li>
            <li>
              <strong>Custom Web Server Logs</strong>
              <code>.log, .txt</code>
            </li>
          </ul>

          <h3>🔍 What We Analyze</h3>
          <ul className="analysis-list">
            <li>SQL Injection attempts</li>
            <li>Directory traversal attacks</li>
            <li>Suspicious user agents</li>
            <li>High-frequency request behavior</li>
            <li>Abnormal HTTP status code patterns</li>
          </ul>

          <div className="info-note">
            <strong>💡 Note:</strong> All processing is done locally. Your log files are not sent to any external servers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogUpload;