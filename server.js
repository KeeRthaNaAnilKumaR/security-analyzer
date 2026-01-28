import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize Database
// Initialize Database with your specific schema
(async () => {
    db = await open({
        filename: './security_analysis.db',
        driver: sqlite3.Database
    });

    // Table 1: Stores every parsed log entry
    await db.exec(`
        CREATE TABLE IF NOT EXISTS parsed_logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME NOT NULL,
            ip_address TEXT NOT NULL,
            req_method TEXT NOT NULL,
            req_url TEXT NOT NULL,
            status_code INTEGER NOT NULL,
            response_size INTEGER,
            user_agent TEXT,
            event_type TEXT,
            security_level TEXT
        )
    `);

    // Table 2: Stores specific security-related events
    await db.exec(`
        CREATE TABLE IF NOT EXISTS security_events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_id INTEGER,
            timestamp DATETIME NOT NULL,
            ip_address TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_description TEXT,
            security_level TEXT NOT NULL,
            detection_rule TEXT,
            FOREIGN KEY (log_id) REFERENCES parsed_logs(log_id)
        )
    `);
    console.log("✅ SQLite Database Ready with Parsed_Logs and Security_Events tables.");
})();

// Basic API to get logs
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await db.all('SELECT * FROM logs ORDER BY id DESC');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

const PORT = 3001;
// Add this to server.js
app.get('/', (req, res) => {
    res.send('Security Analyzer API is running...');
});
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));