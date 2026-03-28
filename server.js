import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- UPDATED MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Keeps original extension but adds timestamp to prevent name collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for larger log files
    fileFilter: (req, file, cb) => {
        const filetypes = /log|txt|text/; // Support .log and .txt variants
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports .log or .txt files!"));
    }
});

const config = {
    user: 'keer_user',
    password: 'root123',
    server: '127.0.0.1',
    database: 'SecurityAnalyzerDB',
    options: {
        instanceName: 'SQLEXPRESS',
        encrypt: false,
        trustServerCertificate: true,
        port: 1433
    }
};

let pool;

app.get('/', (req, res) => {
    res.send('<h1>✅ Security Analyzer API Online</h1>');
});

// --- UPDATED UPLOAD & ANALYSIS ROUTE ---
app.post('/api/upload', upload.single('logFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // path.resolve ensures the Python script gets the FULL absolute path
    const filePath = path.resolve(req.file.path);
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    console.log(`📂 Processing: ${req.file.originalname} -> ${filePath}`);

    // Wrapped filePath in escaped quotes to handle filenames with spaces
    exec(`${pythonCmd} analyzer.py "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Analysis Error: ${error.message}`);
            return res.status(500).json({ error: "Analysis engine failed" });
        }
        if (stderr) console.warn(`⚠️ Python Warning: ${stderr}`);
        
        console.log(`✅ Success: Processed ${req.file.originalname}`);
        res.json({ message: `Analysis complete for ${req.file.originalname}!` });
    });
});

// GET ROUTES
app.get('/api/logs', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM parsed_logs ORDER BY timestamp DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

app.get('/api/events', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM security_events ORDER BY timestamp DESC');
        res.json(result.recordset);
    } catch (err) { res.status(500).send(err.message); }
});

// CLEAR DATABASE ROUTE
app.delete('/api/clear-database', async (req, res) => {
    if (!pool) return res.status(500).json({ error: "Database not connected" });
    const transaction = new sql.Transaction(pool); 
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);
        await request.query('DELETE FROM security_events');
        await request.query('DELETE FROM parsed_logs');
        await request.query("DBCC CHECKIDENT ('security_events', RESEED, 0)");
        await request.query("DBCC CHECKIDENT ('parsed_logs', RESEED, 0)");
        await transaction.commit();
        console.log("🗑️ Database cleared successfully.");
        res.json({ message: "Database cleared successfully!" });
    } catch (err) {
        if (transaction._isStarted) await transaction.rollback();
        res.status(500).json({ error: "Database clear failed", details: err.message });
    }
});

async function startServer() {
    try {
        pool = await sql.connect(config); 
        console.log("✅ Connected to SQL Server");
        const server = app.listen(PORT, () => {
            console.log(`🚀 API running on http://localhost:${PORT}`);
        });
        server.timeout = 120000; // Increased timeout to 2 mins for large logs
    } catch (err) {
        console.error("❌ Connection Failed:", err);
    }
}

startServer();