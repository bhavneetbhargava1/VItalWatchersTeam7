// By: Anagha Krishna, Binal Dhaliwal, Bhavneet Bhargava
// Group: 7
const express = require('express');
const router = express.Router();
const pool = require('../dbConfig');

/**
 * Query 3: High-Risk Patients
 *
 * Purpose:
 * - This route handles requests to fetch detailed information about high-risk patients.
 * - High-risk patients are identified based on unresolved alerts of type 'CRITICAL' or 'HIGH'
 *   and vitals exceeding critical thresholds.
 *
 * Special Features:
 * - Includes patient details, vital statistics, alert level, and provider information.
 * - Checks if vital signs exceed thresholds using subqueries for dynamic threshold values.
 * - Uses **CASE** statements to evaluate whether vital signs exceed critical thresholds,
 *   providing clear flags for each vital category.
 * - Joins multiple tables (PATIENTS, ALERTS, VITALS, PATCH_DEVICE, HEALTH_SUMMARY, PROVIDERS)
 *   to provide a comprehensive view of high-risk patients.
 * - Filters only unresolved alerts to ensure relevance.
 * - Orders results by alert timestamp in descending order for prioritization.
 * - Returns data in JSON format for easy integration with frontend systems.
 * - The remaining is discussed in the corresponding HTML file (query3.html).
 *
 * Phase II Queries:
 * - This file corresponds to **Phase II, Query 10.
 */
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


        const [rows] = await pool.query(sqlQuery);

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Failed to retrieve high-risk patient data.' });
    }
});

module.exports = router;






