// By: Anagha Krishna, Binal Dhaliwal, Bhavneet Bhargava
// Group: 7
const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

/**
 * Query 5: High Heart Rate Data
 *
 * Purpose:
 * - This route retrieves data for patients with elevated heart rates, flagged by corresponding alerts.
 * - Provides patient details, heart rate values, alert types, and timestamps.
 *
 * Special Features:
 * - Joins PATIENTS, VITALS, and ALERTS tables to gather comprehensive information on heart rate-related alerts.
 * - Filters results to include only alerts with types 'HIGH' or 'ELEVATED' to focus on actionable data.
 * - Orders results first by descending heart rate to prioritize the most critical cases,
 *   and then by descending alert timestamp for recent occurrences.
 * - Limits the output to the top 10 results for streamlined data presentation.
 * - Processes data to include a combined patient name and ensures alert timestamps are formatted in ISO 8601 for frontend compatibility.
 * - Returns data in JSON format for easy integration with frontend systems.
 * - The remaining is discussed in the corresponding HTML file (query3.html).
 *
 * Phase II Queries:
 * - This file corresponds to **Phase II, Query 5.
 */
router.get('/high-heart-rate-data', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                p.Patient_ID,
                p.First_name,
                p.Last_name,
                v.Heart_rate,
                a.Alert_type,
                a.Time_stamp AS Alert_Time
            FROM PATIENTS p
                     JOIN VITALS v ON p.Patient_ID = v.PATIENT_ID
                     JOIN ALERTS a ON p.Patient_ID = a.PATIENT_ID
            WHERE a.Alert_type IN ('HIGH', 'ELEVATED')
            ORDER BY v.Heart_rate DESC, a.Time_stamp DESC
                LIMIT 10;
        `;

        const [rows] = await pool.query(sqlQuery);


        const processedData = rows.map(row => ({
            patientId: row.Patient_ID,
            patientName: `${row.First_name} ${row.Last_name}`,
            heartRate: row.Heart_rate,
            alertType: row.Alert_type,
            alertTime: row.Alert_Time ? row.Alert_Time.toISOString() : null
        }));


        res.status(200).json(processedData);
    } catch (err) {
        console.error('Error fetching high heart rate data:', err.message);
        res.status(500).json({ error: 'Failed to retrieve high heart rate data.' });
    }
});
module.exports = router;
