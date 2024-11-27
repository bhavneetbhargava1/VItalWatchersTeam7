/**
 * Author: Bhavneet Bhargava
 * Class: TCSS 445 - Database Systems Design
 * Assignment: Assignment 4 - Department Analytics Controller
 * 
 * This file contains server-side controller functions to query and manage 
 * department-related data in the COMPANY database. Each function performs
 * a specific SQL query to fetch department analytics, including salary stats, 
 * employee counts, project assignments, and budget analysis. 
 * 
 * Features:
 * - Uses MySQL queries with joins, aggregations, and sorting.
 * - Handles errors gracefully with appropriate logging and responses.
 * - Designed for a modern web interface to visualize department data.
 */

// Import the database configuration
const db = require('../dbConfig');

/**
 * Fetches salary statistics for each department, including:
 * - Average Salary
 * - Maximum Salary
 * - Minimum Salary
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the DEPARTMENT table to the EMPLOYEE table.
 * - GROUP BY: Groups results by department name.
 * - HAVING: Ensures departments with no salaries are excluded.
 * - ORDER BY: Orders the departments by their average salary in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getDepartmentSalaryStats = (req, res) => {
    const query = `
        SELECT 
            d.Dname AS DepartmentName,
            AVG(e.Salary) AS AverageSalary,
            MAX(e.Salary) AS MaxSalary,
            MIN(e.Salary) AS MinSalary
        FROM DEPARTMENT d
        LEFT JOIN EMPLOYEE e ON d.Dnumber = e.Dno
        GROUP BY d.Dname
        HAVING AVG(e.Salary) IS NOT NULL
        ORDER BY AverageSalary DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching department salary stats:', err);
            res.status(500).send('Error fetching department salary statistics');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches the count of employees in each department.
 * 
 * Query Explanation:
 * - LEFT JOIN: Ensures all departments are included, even if they have no employees.
 * - COUNT: Counts the number of employees in each department.
 * - GROUP BY: Groups results by department name.
 * - ORDER BY: Orders departments by the employee count in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getEmployeeCountByDepartment = (req, res) => {
    const query = `
        SELECT 
            d.Dname AS DepartmentName,
            COUNT(e.Ssn) AS EmployeeCount
        FROM DEPARTMENT d
        LEFT JOIN EMPLOYEE e ON d.Dnumber = e.Dno
        GROUP BY d.Dname
        ORDER BY EmployeeCount DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employee count:', err);
            res.status(500).send('Error fetching employee count');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches the number of projects assigned to each department.
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the DEPARTMENT table to the PROJECT table.
 * - COUNT: Counts the number of projects associated with each department.
 * - GROUP BY: Groups results by department name.
 * - ORDER BY: Orders departments by the project count in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getProjectsPerDepartment = (req, res) => {
    const query = `
        SELECT 
            d.Dname AS DepartmentName,
            COUNT(p.Pnumber) AS ProjectCount
        FROM DEPARTMENT d
        LEFT JOIN PROJECT p ON d.Dnumber = p.Dnum
        GROUP BY d.Dname
        ORDER BY ProjectCount DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching projects per department:', err);
            res.status(500).send('Error fetching projects per department');
        } else {
            res.json(results);
        }
    });
};

/**
 * Fetches budget analysis for each department, including:
 * - Total Salary Cost
 * - Percentage Contribution to the Company-Wide Salary Budget
 * 
 * Query Explanation:
 * - LEFT JOIN: Connects the DEPARTMENT table to the EMPLOYEE table.
 * - SUM: Sums the salary for each department.
 * - Subquery: Calculates the total salary for all employees company-wide.
 * - HAVING: Excludes departments with no salary data.
 * - ORDER BY: Orders departments by total salary cost in descending order.
 * 
 * Error Handling:
 * - Logs an error message if the query fails.
 * - Sends a 500 status response to indicate a server-side issue.
 */
const getDepartmentBudgetAnalysis = (req, res) => {
    const query = `
        SELECT 
            d.Dname AS DepartmentName,
            SUM(e.Salary) AS TotalSalaryCost,
            ROUND((SUM(e.Salary) / (SELECT SUM(Salary) FROM EMPLOYEE)) * 100, 2) AS SalaryPercentage
        FROM DEPARTMENT d
        LEFT JOIN EMPLOYEE e ON d.Dnumber = e.Dno
        GROUP BY d.Dname
        HAVING SUM(e.Salary) > 0
        ORDER BY TotalSalaryCost DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching department budget analysis:', err);
            res.status(500).send('Error fetching department budget analysis');
        } else {
            res.json(results);
        }
    });
};

/**
 * Exports all the department-related query functions.
 */
module.exports = {
    getDepartmentSalaryStats,
    getEmployeeCountByDepartment,
    getProjectsPerDepartment,
    getDepartmentBudgetAnalysis,
};
