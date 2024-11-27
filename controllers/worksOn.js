/**
 * Author: Bhavneet Bhargava
 * Class: TCSS 445 - Database Systems Design
 * Assignment: Assignment 4 - Works On Analysis Controller
 * 
 * This file contains server-side controller functions to query and manage 
 * data related to employee assignments and collaborations in the COMPANY 
 * database. Each function performs specific SQL queries to analyze hours 
 * worked, participation metrics, workload distribution, and cross-department 
 * collaboration.
 * 
 * Features:
 * - Uses MySQL queries with joins, aggregations, and sorting.
 * - Includes subqueries and HAVING clauses for advanced filtering.
 * - Handles errors gracefully with appropriate logging and responses.
 */

// Import the database configuration
const db = require('../dbConfig');

/**
 * Fetches employees who have worked more than 20 hours in total.
 * 
 * Query Explanation:
 * - JOIN: Connects the EMPLOYEE table to the WORKS_ON table.
 * - SUM: Calculates the total hours worked for each employee.
 * - GROUP BY: Groups results by employee ID and name.
 * - HAVING: Filters employees with more than 20 total hours worked.
 * - ORDER BY: Orders results by total hours worked in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getHoursWorkedAnalysis = (req, res) => {
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
};

/**
 * Fetches the number of unique employees participating in each project.
 * 
 * Query Explanation:
 * - LEFT JOIN: Ensures all projects are included, even if no employees are assigned.
 * - COUNT(DISTINCT): Counts unique employees working on each project.
 * - GROUP BY: Groups results by project name.
 * - HAVING: Filters out projects with no participants.
 * - ORDER BY: Orders results by the number of participants in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getProjectParticipationMetrics = (req, res) => {
    const query = `
        SELECT 
            p.Pname AS ProjectName,
            COUNT(DISTINCT w.Essn) AS NumberOfParticipants
        FROM PROJECT p
        LEFT JOIN WORKS_ON w ON p.Pnumber = w.Pno
        GROUP BY p.Pname
        HAVING COUNT(DISTINCT w.Essn) > 0
        ORDER BY NumberOfParticipants DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching project participation metrics:', err);
            res.status(500).send('Error fetching project participation metrics');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches total hours worked by each employee, along with their department.
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the EMPLOYEE table to the WORKS_ON and DEPARTMENT tables.
 * - COALESCE: Ensures total hours worked is displayed as 0 for employees without records.
 * - GROUP BY: Groups results by employee and department details.
 * - ORDER BY: Orders employees by total hours worked in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getEmployeeWorkloadDistribution = (req, res) => {
    const query = `
        SELECT 
            e.Ssn AS EmployeeID,
            CONCAT(e.Fname, ' ', e.Lname) AS EmployeeName,
            d.Dname AS DepartmentName,
            COALESCE(SUM(w.Hours), 0) AS TotalHoursWorked
        FROM EMPLOYEE e
        LEFT JOIN WORKS_ON w ON e.Ssn = w.Essn
        LEFT JOIN DEPARTMENT d ON e.Dno = d.Dnumber
        GROUP BY e.Ssn, e.Fname, e.Lname, d.Dname
        ORDER BY TotalHoursWorked DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employee workload distribution:', err);
            res.status(500).send('Error fetching employee workload distribution');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches the number of departments involved in each project.
 * 
 * Query Explanation:
 * - JOIN: Connects the WORKS_ON table to the EMPLOYEE and PROJECT tables.
 * - COUNT(DISTINCT): Counts unique departments working on each project.
 * - GROUP BY: Groups results by project number and name.
 * - HAVING: Filters projects involving more than one department.
 * - ORDER BY: Orders results by the number of departments involved in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getCrossDepartmentCollaboration = (req, res) => {
    const query = `
        SELECT 
            p.Pnumber AS ProjectNumber,
            p.Pname AS ProjectName,
            COUNT(DISTINCT e.Dno) AS DepartmentsInvolved
        FROM WORKS_ON w
        JOIN EMPLOYEE e ON w.Essn = e.Ssn
        JOIN PROJECT p ON w.Pno = p.Pnumber
        GROUP BY p.Pnumber, p.Pname
        HAVING COUNT(DISTINCT e.Dno) > 1
        ORDER BY DepartmentsInvolved DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cross-department collaboration:', err);
            res.status(500).send('Error fetching cross-department collaboration');
        } else {
            res.json(results);
        }
    });
};

/**
 * Exports all the Works On-related query functions.
 */
module.exports = {
    getHoursWorkedAnalysis,
    getProjectParticipationMetrics,
    getEmployeeWorkloadDistribution,
    getCrossDepartmentCollaboration,
};
