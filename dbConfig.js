const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Database host
    user: process.env.DB_USER || 'root',      // Database username
    password: process.env.DB_PASSWORD || '',  // Database password
    database: process.env.DB_NAME || 'vital_watchers', // Database name
    port: process.env.DB_PORT || 3306,        // MySQL port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test the connection on pool creation
(async () => {
    try {
        const connection = await pool.getConnection(); // Get a connection
        console.log('Connected to the MySQL database!');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Error connecting to the MySQL database:', err.message);
    }
})();

module.exports = pool;