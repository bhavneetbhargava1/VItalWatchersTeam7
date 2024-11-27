// Step 1: Import Required Libraries
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const db = require('./dbConfig'); // Database configuration
const app = express();

// Step 2: Import Controllers
// Import the employee, department, and project controllers
const employeeController = require('./controllers/employee');
const departmentController = require('./controllers/department');
const projectController = require('./controllers/project');

// Step 3: Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from the 'public' directory

// Step 4: Define Routes
// Employee Routes
app.get('/employee', employeeController.getAllEmployees);
app.get('/employee/details', employeeController.getEmployeeDetails);

// Department Routes
app.get('/department/salary-stats', departmentController.getDepartmentSalaryStats);
app.get('/department/employee-count', departmentController.getEmployeeCountByDepartment);
app.get('/department/projects', departmentController.getProjectsPerDepartment);
app.get('/department/budget', departmentController.getDepartmentBudgetAnalysis);

// Project Routes
app.get('/project/duration-analysis', projectController.getProjectDurationAnalysis);
app.get('/project/resource-allocation', projectController.getResourceAllocation);
app.get('/project/completion-status', projectController.getProjectCompletionStatus);
app.get('/project/employee-assignments', projectController.getEmployeeAssignments);

// worksOn Routes
// Example Route: Hours Worked Analysis
app.get('/worksOn/hours-worked', (req, res) => {
    const query = `
        SELECT 
            e.Ssn AS EmployeeID,
            CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName,
            SUM(w.Hours) AS TotalHoursWorked
        FROM EMPLOYEE e
        JOIN WORKS_ON w ON e.Ssn = w.Essn
        GROUP BY e.Ssn, e.Fname, e.Lname
        HAVING SUM(w.Hours) > 20
        ORDER BY TotalHoursWorked DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching hours worked analysis:', err);
            res.status(500).send('Error fetching hours worked analysis');
        } else {
            res.json(results);
        }
    });
});

// Step 5: Start the Server
const PORT = process.env.PORT || 5000; // Default port is 5000 if not specified in .env

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
