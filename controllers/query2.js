// By: Anagha Krishna, Binal Dhaliwal, Bhavneet Bhargava
// Group: 7
const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

/**
 * Query 2: Active Alerts
 *
 * Purpose:
 * - This route handles requests to fetch information about unresolved alerts (active alerts).
 * - It provides details such as alert type, patient name, timestamp of the alert,
 *   and the status of the patch device associated with the alert.
 *
 * Special Features:
 * - Filters only unresolved alerts (A.Resolved = 'F').
 * - Ensures the associated patch device is active (PD.Patch_status = 'Active').
 * - Orders results by alert timestamp in descending order for easy prioritization of recent alerts.
 * - Returns data in JSON format for easy frontend integration.
 * - The remaining is discussed in the corresponding HTML file (query2.html).
 *
 * Note:
 * - This file (query2.js) implements Phase II Query 2.
 */

router.get('/active-alerts', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                A.Alert_ID,
                CONCAT(P.First_name, ' ', P.Last_name) AS Patient_Name,
                A.Alert_type,
                A.Time_stamp AS Alert_Time,
                PD.Patch_status AS Device_Status
            FROM
                vital_watchers.ALERTS AS A
                    INNER JOIN vital_watchers.PATIENTS AS P ON A.Patient_ID = P.Patient_ID
                    INNER JOIN vital_watchers.PATCH_DEVICE AS PD ON A.Device_ID = PD.Device_ID
            WHERE
                A.Resolved = 'F' AND PD.Patch_status = 'Active'
            ORDER BY
                A.Time_stamp DESC;
        `;


        const [rows] = await pool.query(sqlQuery);


        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Failed to fetch active alert data.' });
    }
});

module.exports = router;


