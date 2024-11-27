// Step 1: Import Required Libraries
// Import the database configuration to interact with the MySQL database.
const db = require('../dbConfig');
// Step 2: Define Controller Functions
// This function constructs a SQL query to retrieve basic employee information
// (SSN, First Name, and Last Name) and sends the results as JSON.
const getAllEmployees = (req, res) => {
// Step 2.1: Construct SQL Query
const query = `
SELECT Ssn AS SSN, Fname, Lname
FROM EMPLOYEE
`;
// Step 2.2: Execute the Query
db.query(query, (err, results) => {
if (err) {
// Step 2.3: Handle Errors
console.error('Error fetching employees:', err);
res.status(500).send('Error fetching employee list');
} else {
// Step 2.4: Send Results
res.json(results); // Send the employee list as a JSON response
}
});
};
// Fetches detailed information for a specific employee.
// The details include the employee's name, manager's name, department, salary, and birthdate.
const getEmployeeDetails = (req, res) => {
// Step 3.1: Extract Parameters
const { SSN } = req.query;
if (!SSN) {
// Step 3.2: Validate Input
return res.status(400).send('SSN is required');
}
// Step 3.3: Construct SQL Query
const query = `
SELECT
CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName,
CONCAT(m.Fname, ' ', m.Lname) AS ManagerName,
d.Dname AS DepartmentName,
e.Salary AS Salary,
e.Bdate AS BirthDate
FROM EMPLOYEE e
LEFT JOIN EMPLOYEE m ON e.Super_ssn = m.Ssn
JOIN DEPARTMENT d ON e.Dno = d.Dnumber
WHERE e.Ssn = ?
`;
// Step 3.4: Execute the Query
db.query(query, [SSN], (err, results) => {
if (err) {
// Step 3.5: Handle Errors
console.error('Error fetching employee details:', err);
res.status(500).send('Error retrieving employee details');
} else {
// Step 3.6: Send Results
res.json(results); // Send employee details as JSON
}
});
};
// Step 4: Export the Controller Functions
// Export the functions so they can be used in server.js or other parts of the application.
module.exports = {
getAllEmployees,
getEmployeeDetails,
};
