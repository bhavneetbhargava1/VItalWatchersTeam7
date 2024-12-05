/**
 * @fileoverview MySQL database configuration and connection pool setup
 * @author Binal Dhaliwal, Anagha Krishna, Bhavneet Bhargava
 * @requires mysql2/promise
 */
const mysql = require('mysql2/promise');

/**
 * MySQL Connection Pool Configuration
 * Creates a pool of connections to the MySQL database with the following parameters:
 * @constant {Object} pool
 * @property {string} host - Database host (default: 'localhost')
 * @property {string} user - Database user (default: 'root')
 * @property {string} password - Database password (default: '')
 * @property {string} database - Database name (default: 'vital_watchers')
 * @property {number} port - Database port (default: 3306)
 * @property {boolean} waitForConnections - Whether to wait for connections if the pool is full
 * @property {number} connectionLimit - Maximum number of connections in the pool
 * @property {number} queueLimit - Maximum number of connection requests to queue (0 = unlimited)
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vital_watchers',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Immediately Invoked Function Expression (IIFE) to test database connection
 * Attempts to establish an initial connection to verify database accessibility
 * Logs success or error message to console
 * @async
 * @throws {Error} If connection to database fails
 */
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL database!');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the MySQL database:', err.message);
    }
})();

/**
 * Export the connection pool for use in other modules
 * @exports pool
 */
module.exports = pool;