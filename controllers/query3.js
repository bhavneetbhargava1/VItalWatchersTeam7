const express = require('express');
const router = express.Router();
const pool = require('../dbConfig'); // Import the database pool

// Route to fetch high-risk patient data
router.get('/high-risk-patients', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT
                P.Patient_ID,
                P.Full_name AS Patient_Name,
                P.Age AS Patient_Age,
                P.Medical_history AS Medical_History,
                V.Blood_pressure,
                V.Heart_rate,
                V.Body_temperature,
                V.Oxygen_saturation,
                V.Breathing_rate,
                A.Alert_type AS Alert_Level,
                A.Time_stamp AS Alert_Time,
                PD.Patch_status AS Device_Status,
                PD.Patient_address AS Monitoring_Location,

                -- Join the PROVIDERS table to get the provider's information
                CONCAT(PR.First_name, ' ', PR.Last_name) AS Provider_Name,

                -- Check if vitals exceed thresholds
                CASE
                    WHEN V.Blood_pressure < (SELECT Minimum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Blood Pressure' AND Vital_level = 'BP_Critical') OR
                         V.Blood_pressure > (SELECT Maximum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Blood Pressure' AND Vital_level = 'BP_Critical')
                        THEN 1 ELSE 0
                    END AS Blood_Pressure_Exceeded,

                CASE
                    WHEN V.Heart_rate < (SELECT Minimum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Heart Rate' AND Vital_level = 'HR_Critical') OR
                         V.Heart_rate > (SELECT Maximum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Heart Rate' AND Vital_level = 'HR_Critical')
                        THEN 1 ELSE 0
                    END AS Heart_Rate_Exceeded,

                CASE
                    WHEN V.Body_temperature < (SELECT Minimum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Body Temperature' AND Vital_level = 'BT_High Fever') OR
                         V.Body_temperature > (SELECT Maximum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Body Temperature' AND Vital_level = 'BT_High Fever')
                        THEN 1 ELSE 0
                    END AS Body_Temperature_Exceeded,

                CASE
                    WHEN V.Oxygen_saturation < (SELECT Minimum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Oxygen Saturation' AND Vital_level = 'OS_Critical') OR
                         V.Oxygen_saturation > (SELECT Maximum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Oxygen Saturation' AND Vital_level = 'OS_Critical')
                        THEN 1 ELSE 0
                    END AS Oxygen_Saturation_Exceeded,

                CASE
                    WHEN V.Breathing_rate < (SELECT Minimum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Breathing Rate' AND Vital_level = 'BR_Critical') OR
                         V.Breathing_rate > (SELECT Maximum_value FROM vital_watchers.VITAL_THRESHOLDS WHERE Vital_category = 'Breathing Rate' AND Vital_level = 'BR_Critical')
                        THEN 1 ELSE 0
                    END AS Breathing_Rate_Exceeded
            FROM
                vital_watchers.PATIENTS AS P
                    INNER JOIN vital_watchers.ALERTS AS A ON P.Patient_ID = A.Patient_ID
                    INNER JOIN vital_watchers.VITALS AS V ON P.Patient_ID = V.Patient_ID
                    LEFT JOIN vital_watchers.PATCH_DEVICE AS PD ON P.Patient_ID = PD.Patient_ID
                    LEFT JOIN vital_watchers.HEALTH_SUMMARY AS HS ON P.Patient_ID = HS.Patient_ID  -- Join with HEALTH_SUMMARY
                    LEFT JOIN vital_watchers.PROVIDERS AS PR ON HS.Provider_ID = PR.Provider_ID  -- Join with PROVIDERS using Provider_ID from HEALTH_SUMMARY
            WHERE
                A.Resolved = 'F' -- Include only unresolved alerts
              AND A.Alert_type IN ('CRITICAL', 'HIGH') -- Include only high or critical alerts
            ORDER BY
                A.Time_stamp DESC;
        `;


        // Execute the query
        const [rows] = await pool.query(sqlQuery);

        // Return the results as JSON
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Failed to retrieve high-risk patient data.' });
    }
});

module.exports = router;




