// Step 1: Import Required Libraries
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const db = require('./dbConfig'); // Database configuration
const app = express();

// Step 2: Import Controllers
// Import your custom controllers, including query2, query3, and query4
const query2Controller = require('./controllers/query2'); // Import query2 controller
const query3Controller = require('./controllers/query3'); // Import query3 controller
const query4Controller = require('./controllers/query4'); // Import query4 controller

// Step 3: Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the 'public' directory

// Step 4: Define Routes
// Query 2 Route (JSON and Dynamic Display Pattern)
app.use('/api/query2', query2Controller); // Correct route for query2

// Query 3 Route
app.use('/api/query3', query3Controller); // Add route for query3

// Query 4 Route
app.use('/api/query4', query4Controller); // Add route for query4

// Step 5: Start the Server
const PORT = process.env.PORT || 5000; // Default port is 5000 if not specified in .env
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
