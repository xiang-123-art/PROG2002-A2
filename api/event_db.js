// =====================================================
// event_db.js - Database connection module
// PROG2002 Assessment 2 - Charity Events Website
// Connects the Node.js API server to the MySQL
// database "charityevents_db" (XAMPP MySQL, port 3306)
// =====================================================

const mysql = require('mysql2');

// Connection pool: efficient reuse of database connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // XAMPP default root has no password
    database: process.env.DB_NAME || 'charityevents_db',
    port: Number(process.env.DB_PORT) || 3306,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use Promises so we can use async/await in the API
const db = pool.promise();

// Quick connectivity check when this module is first loaded
db.query('SELECT 1')
    .then(() => console.log(`[event_db] Connected to MySQL database "${process.env.DB_NAME || 'charityevents_db'}"`))
    .catch(err => console.error('[event_db] Database connection failed:', err.message));

module.exports = db;
