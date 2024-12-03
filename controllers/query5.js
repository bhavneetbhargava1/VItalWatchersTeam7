const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

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