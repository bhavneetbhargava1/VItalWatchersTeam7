/**
 * Author: Bhavneet Bhargava
 * Class: TCSS 445 - Database Systems Design
 * Assignment: Assignment 4 - Project Analytics Controller
 * 
 * This file contains server-side controller functions to query and manage 
 * project-related data in the COMPANY database. Each function performs
 * a specific SQL query to fetch project analytics, including duration analysis, 
 * resource allocation, completion status, and employee assignments.
 * 
 * Features:
 * - Uses MySQL queries with joins, aggregations, and sorting.
 * - Handles errors gracefully with appropriate logging and responses.
 * - Designed for a modern web interface to visualize project data.
 */

// Import the database configuration
const db = require('../dbConfig');

/**
 * Fetches the total hours worked on each project.
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the PROJECT table to the WORKS_ON table.
 * - SUM: Calculates the total hours worked for each project.
 * - GROUP BY: Groups results by project name.
 * - ORDER BY: Sorts projects by total hours worked in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getProjectDurationAnalysis = (req, res) => {
    const query = `
        SELECT 
            p.Pname AS ProjectName,
            SUM(w.Hours) AS TotalHoursWorked
        FROM PROJECT p
        LEFT JOIN WORKS_ON w ON p.Pnumber = w.Pno
        GROUP BY p.Pname
        ORDER BY TotalHoursWorked DESC, p.Pname;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching project duration analysis:', err);
            res.status(500).send('Error fetching project duration analysis');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches the number of employees assigned to each project.
 * 
 * Query Explanation:
 * - LEFT JOIN: Ensures all projects are included, even if they have no employees assigned.
 * - COUNT: Counts the number of unique employees working on each project.
 * - GROUP BY: Groups results by project name.
 * - ORDER BY: Orders projects by the total number of employees in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getResourceAllocation = (req, res) => {
    const query = `
        SELECT 
            p.Pname AS ProjectName,
            COUNT(w.Essn) AS TotalEmployees
        FROM PROJECT p
        LEFT JOIN WORKS_ON w ON p.Pnumber = w.Pno
        GROUP BY p.Pname
        ORDER BY TotalEmployees DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching resource allocation:', err);
            res.status(500).send('Error fetching resource allocation');
        } else {
            res.json(results);
        }
    });
};

/**
 * Determines the completion status of each project:
 * - "In Progress": Projects with any recorded work hours.
 * - "Not Started": Projects with no recorded work hours.
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the PROJECT table to the WORKS_ON table.
 * - CASE: Evaluates whether a project has recorded hours to determine its status.
 * - GROUP BY: Groups results by project name.
 * - ORDER BY: Orders projects by status and project name.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getProjectCompletionStatus = (req, res) => {
    const query = `
        SELECT 
            p.Pname AS ProjectName,
            CASE 
                WHEN SUM(w.Hours) > 0 THEN 'In Progress'
                ELSE 'Not Started'
            END AS Status
        FROM PROJECT p
        LEFT JOIN WORKS_ON w ON p.Pnumber = w.Pno
        GROUP BY p.Pname
        ORDER BY Status, p.Pname;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching project completion status:', err);
            res.status(500).send('Error fetching project completion status');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches employee assignments for each project, including:
 * - Employee Name
 * - Assigned Hours
 * 
 * Query Explanation:
 * - JOIN: Connects the PROJECT table to WORKS_ON and EMPLOYEE tables.
 * - CONCAT: Combines first and last names of employees.
 * - ORDER BY: Sorts results by project name and employee names.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getEmployeeAssignments = (req, res) => {
    const query = `
        SELECT 
            p.Pname AS ProjectName,
            CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName,
            w.Hours AS AssignedHours
        FROM PROJECT p
        JOIN WORKS_ON w ON p.Pnumber = w.Pno
        JOIN EMPLOYEE e ON w.Essn = e.Ssn
        ORDER BY p.Pname, e.Lname, e.Fname;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employee assignments:', err);
            res.status(500).send('Error fetching employee assignments');
        } else {
            res.json(results);
        }
    });
};

/**
 * Exports all the project-related query functions.
 */
module.exports = {
    getProjectDurationAnalysis,
    getResourceAllocation,
    getProjectCompletionStatus,
    getEmployeeAssignments,
};
