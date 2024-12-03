const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

router.get('/patient-authorization-summary', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                UA.User_ID,
                UA.Patient_ID,
                UA.User_code AS Authorization_Code,
                UA.Activation AS Is_Activated,
                P.Email AS Authorized_Email,
                P.Full_name AS Patient_Name,
                P.Age AS Patient_Age,
                P.Medical_history AS Medical_History,
                HS.Date AS Last_Health_Check_Date,
                HS.Vital_signs AS Vital_Signs,
                HS.Treatments AS Treatments_Provided,
                HS.Provider_notes AS Provider_Notes,
                CONCAT(PR.First_name, ' ', PR.Last_name) AS Provider_Name
            FROM
                USER_AUTHORIZATION AS UA
                    JOIN
                PATIENTS AS P ON UA.Patient_ID = P.Patient_ID
                    JOIN
                HEALTH_SUMMARY AS HS ON P.Patient_ID = HS.Patient_ID
                    JOIN
                PROVIDERS AS PR ON HS.Provider_ID = PR.Provider_ID
            ORDER BY
                UA.Activation DESC,
                P.Full_name ASC,
                HS.Date DESC;
        `;

        const [rows] = await pool.query(sqlQuery);

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error retrieving patient authorization summary:', err.message);
        res.status(500).json({ error: 'Failed to retrieve patient authorization summary.' });
    }
});

module.exports = router;
