/**
 * @fileoverview Main server configuration and route setup for the API
 * @author Binal Dhaliwal, Anagha Krishna, Bhavneet Bhargava
 * @version 1.0.0
 */
// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const db = require('./dbConfig');
const app = express();

// Import route controllers
const query1Controller = require('./controllers/query1');
const query2Controller = require('./controllers/query2');
const query3Controller = require('./controllers/query3');
const query4Controller = require('./controllers/query4');
const query5Controller = require('./controllers/query5');
const query6Controller = require('./controllers/query6');

/**
 * Middleware Configuration
 * - express.json(): Parses incoming JSON payloads
 * - express.static(): Serves static files from 'public' directory
 * - /images route: Serves image files from 'images' directory
 */
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

/**
 * API Routes Configuration
 * Each route is handled by its respective controller:
 * - /api/query1: Handles first query operations
 * - /api/query2: Handles second query operations
 * - /api/query3: Handles third query operations
 * - /api/query4: Handles fourth query operations
 * - /api/query5: Handles fifth query operations
 * - /api/query6: Handles sixth query operations
 */
app.use('/api/query1', query1Controller);
app.use('/api/query2', query2Controller);
app.use('/api/query3', query3Controller);
app.use('/api/query4', query4Controller);
app.use('/api/query5', query5Controller);
app.use('/api/query6', query6Controller);

/**
 * Server Configuration
 * Port is set from environment variables with fallback to 5000
 * @constant {number} PORT - The port number for the server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
