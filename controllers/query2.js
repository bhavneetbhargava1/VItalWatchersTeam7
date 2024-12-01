const express = require('express');
const router = express.Router();
const pool = require('../dbConfig'); // Import the database pool

// Route to handle Query 2 (Active Alert Analysis)
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

        // Execute the query
        const [rows] = await pool.query(sqlQuery);

        // Return results as JSON
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Failed to fetch active alert data.' });
    }
});

module.exports = router;
