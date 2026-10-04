// =====================================================
// event_db.js - Database connection module
// PROG2002 Assessment 2 - Charity Events Website
// Connects the Node.js API server to the MySQL
// database "charityevents_db" (XAMPP MySQL, port 3306)
// =====================================================

const mysql = require('mysql2');

// Connection pool: efficient reuse of database connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',          // XAMPP default MySQL root has no password
    database: 'charityevents_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use Promises so we can use async/await in the API
const db = pool.promise();

// Quick connectivity check when this module is first loaded
db.query('SELECT 1')
    .then(() => console.log('[event_db] Connected to MySQL database "charityevents_db"'))
    .catch(err => console.error('[event_db] Database connection failed:', err.message));

module.exports = db;
