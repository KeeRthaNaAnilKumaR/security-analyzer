import React, { useState } from 'react';
import './LogUpload.css';

const LogUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // --- DRAG AND DROP HANDLERS ---
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
      // Logic now explicitly accepts both .log and .txt
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith('.log') || fileName.endsWith('.txt')) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        alert('Format Error: Please select a valid .log or .txt file');
      }
    }
  };

  // --- DATABASE CLEAR LOGIC ---
  const handleClearData = async () => {
    if (!window.confirm("Warning: This will permanently wipe all logs and detected threat records from SQL Server. Continue?")) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/clear-database', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Database Purged: All records have been deleted.");
        setUploadStatus(null);
        setFile(null);
        // Optional: Clear visuals cache if you want the charts to reset too
        // localStorage.removeItem('saved_logs');
        // localStorage.removeItem('saved_events');
      } else {
        alert("Error: Database could not be cleared. Check server logs.");
      }
    } catch (error) {
      console.error("Clear Error:", error);
      alert("Network Error: Server appears to be offline.");
    }
  };

  // --- UPLOAD & ANALYSIS LOGIC ---
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus({ type: 'uploading', message: 'The Python Analysis Engine is scanning for SQLi and XSS signatures...' });

    const formData = new FormData();
    formData.append('logFile', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Connection': 'keep-alive' }
      });

      if (response.ok) {
        setUploadStatus({ type: 'success', message: 'Deep Scan Complete! Threat data persisted to SQL Server.' });
      } else {
        setUploadStatus({ type: 'error', message: 'Analysis Interrupted: Check file encoding or server state.' });
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus({ type: 'error', message: 'Critical Error: Analysis request timed out.' });
    } finally {
      setUploading(false);
    }
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
        <h2>Security Log Ingestion</h2>
        <p className="text-secondary">Analyze heterogeneous log data using Regex-based Pattern Matching</p>
      </div>

      <div className="upload-content">
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
                <div className="upload-icon">📄</div>
                <h3>Drag & Drop Log Source</h3>
                <p>Drop your <strong>.log</strong> or <strong>.txt</strong> file here</p>
                
                <label htmlFor="file-input" className="upload-button">
                  Browse Local Files
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".log,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <div className="clear-data-container">
                  <button
                    className="action-btn secondary clear-btn"
                    onClick={handleClearData}
                    title="Wipe SQL Server tables"
                  >
                    🗑️ Reset Database State
                  </button>
                </div>

                <p className="upload-hint">Supported extensions: .log, .txt (Plain Text Encoding)</p>
              </>
            ) : (
              <div className="file-preview">
                <div className="file-icon">{file.name.endsWith('.txt') ? '📝' : '📊'}</div>
                <div className="file-details">
                  <h4>{file.name}</h4>
                  <p>{formatFileSize(file.size)}</p>
                  <p className="file-date">Source: Text/Plain</p>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={() => { setFile(null); setUploadStatus(null); }}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}

            {file && !uploading && (
              <button className="analyze-button" onClick={handleUpload}>
                <span>🚀</span> Start Security Analysis
              </button>
            )}

            {uploading && (
              <div className="analyze-button disabled">
                <span className="loading-spinner"></span> Running Heuristics...
              </div>
            )}
          </div>

          {uploadStatus && (
            <div className={`status-message status-${uploadStatus.type}`}>
              {uploadStatus.type === 'uploading' && <span className="loading-spinner"></span>}
              {uploadStatus.type === 'success' && <span>✅</span>}
              {uploadStatus.type === 'error' && <span>❌</span>}
              <span>{uploadStatus.message}</span>
            </div>
          )}
        </div>

        <div className="info-panel">
          <h3>📋 Architecture Specifications</h3>
          <ul className="format-list">
            <li><strong>Input:</strong> UTF-8 encoded plain text</li>
            <li><strong>Engine:</strong> Python 3 / Regex Pattern Matching</li>
            <li><strong>Storage:</strong> MS SQL Server (Relational)</li>
          </ul>

          <h3>🔍 Attack Vector Coverage</h3>
          <ul className="analysis-list">
            <li><strong>SQLi:</strong> Keywords (UNION, SELECT, DROP)</li>
            <li><strong>XSS:</strong> Script tags and event handlers</li>
            <li><strong>Path Traversal:</strong> Unauthorized directory access</li>
          </ul>

          <div className="info-note">
            <strong>💡 Pro Tip:</strong> Uploading <code>.txt</code> dumps from legacy systems is now fully supported.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogUpload;