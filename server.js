// Step 1: Import Required Libraries
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const db = require('./dbConfig'); // Database configuration
const app = express();

// Step 2: Import Controllers
const query1Controller = require('./controllers/query1'); // Import query1 controller
const query2Controller = require('./controllers/query2'); // Import query2 controller
const query3Controller = require('./controllers/query3'); // Import query3 controller
const query4Controller = require('./controllers/query4'); // Import query4 controller
const query5Controller = require('./controllers/query5'); // Import query5 controller
const query6Controller = require('./controllers/query6'); // Import query5 controller


// Step 3: Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use('/images', express.static('images'));

// Step 4: Define Routes

// Query 1 Route (Direct HTML Pattern)
app.use('/api/query1', query1Controller); // Route to display summary immediately

// Query 2 Route (JSON and Dynamic Display Pattern)
app.use('/api/query2', query2Controller); // Route for query2

// Query 3 Route
app.use('/api/query3', query3Controller); // Route for query3

// Query 4 Route
app.use('/api/query4', query4Controller); // Route for query4

// Query 5 Route
app.use('/api/query5', query5Controller); // Route for query5

app.use('/api/query6', query6Controller); // Route for query5


// Step 5: Start the Server
const PORT = process.env.PORT || 5000; // Default port is 5000 if not specified in .env
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
