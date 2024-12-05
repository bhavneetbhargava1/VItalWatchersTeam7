// By: Anagha Krishna, Binal Dhaliwal, Bhavneet Bhargava
// Group: 7
const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

/**
 * Query 4: Device Status Overview
 *
 * Purpose:
 * - This route handles requests to fetch an overview of patch device statuses.
 * - Provides details such as device ID, associated patient information, device status,
 *   vital status, thresholds, and monitoring location.
 *
 * Special Features:
 * - Joins the PATCH_DEVICE table with the PATIENTS table to include patient names
 *   and relevant details alongside the device information.
 * - Orders results by Device_ID for clarity and structured output.
 * - Returns data in JSON format for easy integration with frontend systems.
 *
 * Phase II Queries:
 * - This file corresponds to **Phase II, Query 4.
 */

router.get('/device-status-overview', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                PD.Device_ID,
                PD.Patient_ID,
                CONCAT(P.First_name, ' ', P.Last_name) AS Patient_Name,
                PD.Patch_status AS Device_Status,
                PD.Vital_status AS Vital_Status,
                PD.Thresholds_ID AS Threshold_ID,
                PD.Patient_address AS Monitoring_Location
            FROM
                vital_watchers.PATCH_DEVICE AS PD
                    INNER JOIN vital_watchers.PATIENTS AS P ON PD.Patient_ID = P.Patient_ID
            ORDER BY
                PD.Device_ID;
        `;

        // Execute the query
        const [rows] = await pool.query(sqlQuery);

        // Return the results as JSON
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Failed to retrieve device status overview.' });
    }
});

module.exports = router;

