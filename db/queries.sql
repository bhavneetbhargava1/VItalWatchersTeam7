-- ***************************
-- Part C: SQL Query Design
-- ***************************
USE vital_watchers;

-- Query 1: Triple Table Join
-- Purpose:
-- This query retrieves a comprehensive summary of authorized patients, including their personal details, authorization status,
-- and latest health check information, along with details about the healthcare provider associated with their most recent visit.
--
-- Summary of Result:
-- 1. Patient authorization details, including user ID, email, phone number, authorization code, and activation status.
-- 2. Personal information of each patient, including first and last name, age, and medical history.
-- 3. Latest health summary details for each patient, such as the date of the health check, vital signs, treatments provided, and provider notes.
-- 4. Information about the healthcare provider who conducted or reviewed the patient’s latest health summary, including the provider's first and last name.
--
-- The result is ordered first by activation status (showing active users first), then alphabetically by patient name, and finally by the most recent health check date for each patient.
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
    PR.First_name AS Provider_First_Name,
    PR.Last_name AS Provider_Last_Name
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





-- SQL Query 2: Retrieve Patient Alert Information for All Alert Types with Active Patch Devices, Grouped by Alert Type and Device
-- Purpose: This query fetches data on patients who have unresolved alerts (all types), active patch devices,
--          and includes provider information related to each patient. It groups results by device ID and alert type
--          to show the frequency of each alert type per device.
-- Summary of Result: Displays the first and last names of patients, device ID, patch status, alert type, count of each
--                    alert type per device, and a list of associated providers for each patient group.

SELECT
    p.First_name,
    p.Last_name,
    pd.Device_ID,
    pd.Patch_Status,
    a.ALERT_TYPE,
    COUNT(a.ALERT_TYPE) AS Alert_Count,
    GROUP_CONCAT(DISTINCT CONCAT(pro.First_name, ' ', pro.Last_name) SEPARATOR ', ') AS Providers
FROM
    PATIENTS AS p
        JOIN ALERTS AS a ON p.Patient_ID = a.PATIENT_ID
        JOIN PATCH_DEVICE AS pd ON p.Patient_ID = pd.Patient_ID
        LEFT JOIN HEALTH_SUMMARY AS hs ON p.Patient_ID = hs.Patient_ID
        LEFT JOIN PROVIDERS AS pro ON hs.Provider_ID = pro.Provider_ID
WHERE
    a.RESOLVED = 'F'
  AND pd.Patch_Status = 'Active'
  AND p.Patient_ID IN (
    SELECT Patient_ID
    FROM ALERTS
    WHERE ALERT_TYPE IN ('CRITICAL', 'HIGH', 'NORMAL')
      AND RESOLVED = 'F'
)
GROUP BY
    p.First_name, p.Last_name, pd.Device_ID, pd.Patch_Status, a.ALERT_TYPE
ORDER BY
    CASE
        WHEN a.ALERT_TYPE = 'CRITICAL' THEN 1
        WHEN a.ALERT_TYPE = 'HIGH' THEN 2
        WHEN a.ALERT_TYPE = 'NORMAL' THEN 3
        END,
    p.Last_name;





-- SQL Query 3: Correlated Nested Query with Proper Aliasing
-- Purpose: To identify patients who are currently "Under Treatment" or "Sick" and have active, unresolved "HIGH" alerts.
--          Additionally, the query ensures these patients have active patch devices.
-- Summary of Result: The query returns the following information for each identified patient:
--                * **First name:** The patient's first name.
--                * **Last name:** The patient's last name.
--                * **Patient status:** The patient's current health status (either "Under Treatment" or "Sick").
--                * **Alert type:** The type of alert, which is "HIGH" in this case.
--                * **Timestamp:** The timestamp of the alert.
SELECT DISTINCT
    p.First_name,
    p.Last_name,
    p.Patient_status,
    a.ALERT_TYPE,
    a.TIME_STAMP
FROM
    PATIENTS AS p
        JOIN ALERTS AS a ON p.Patient_ID = a.PATIENT_ID
WHERE
    p.Patient_status IN ('Under Treatment', 'Sick')
  AND a.ALERT_TYPE = 'HIGH'
  AND a.RESOLVED = 'F'
  AND EXISTS (
    SELECT 1
    FROM PATCH_DEVICE AS pd
    WHERE pd.Patient_ID = p.Patient_ID
      AND pd.Patch_Status = 'Active'
)
ORDER BY
    a.TIME_STAMP DESC;

-- Query 4: Uses a FULL OUTER JOIN
-- purpose: This query retrieves a list of all patients along with the status of any associated patch devices.
-- This includes patients who may not have a patch device and patch devices that may not be assigned to any patient.
-- Summary of result: It shows each patient’s ID, first name, and last name, along with their associated Patch_Status and Vital_Status.

SELECT pname.Patient_ID,
       pname.First_name,
       pname.Last_name,
       pd.Patch_Status,
       pd.Vital_Status
FROM PATIENTS pname
LEFT JOIN PATCH_DEVICE pd ON pname.Patient_ID = pd.Patient_ID

UNION
SELECT pname.Patient_ID,
       pname.First_name,
       pname.Last_name,
       pd.Patch_Status,
       pd.Vital_Status
FROM PATIENTS pname
RIGHT JOIN PATCH_DEVICE pd ON pname.Patient_ID = pd.Patient_ID;

-- Query 5: Uses nested queries with any of the set operations UNION, EXCEPT, or INTERSECT*
-- Purpose: Find patients who have both high heart rate readings and 'HIGH' alerts
-- Summary of result: The result will show the Patient_ID, First_Name, and Last_Name of the patients.

SELECT pname.Patient_ID,
       pname.First_name,
       pname.Last_name
FROM PATIENTS pname
WHERE pname.Patient_ID IN (
    SELECT v.PATIENT_ID
    FROM VITALS v
    WHERE v.HEART_RATE > 100
)
INTERSECT
SELECT pname.Patient_ID,
       pname.First_name,
       pname.Last_name
FROM PATIENTS pname
WHERE pname.Patient_ID IN (
    SELECT a.PATIENT_ID
    FROM ALERTS a
    WHERE a.ALERT_TYPE = 'HIGH'
);


-- Query 6: Create your own non-trivial SQL query (must use at least two tables in FROM clause)
-- Purpose: This query retrieves detailed health information for patients
--           within a specific date range. It also includes contact details
--           for the providers who created the health summaries.

-- Summary of result: The result will be a dataset containing:
--   - Patient information (ID, first name, last name)
--   - Health summary details (date, vital signs, treatments, provider notes)
--   - Provider information (full name, phone number)

SELECT
      pname.Patient_ID,
      pname.First_name,
      pname.Last_name,
      hs.Date,
      hs.Vital_signs,
      hs.Treatments,
      hs.Provider_notes,
      CONCAT(pv.First_name, ' ', pv.Last_name) AS Provider_Name,
      pv.Provider_phone_no
FROM
      PATIENTS pname
        JOIN
      HEALTH_SUMMARY hs ON pname.Patient_ID = hs.Patient_ID
        JOIN
      PROVIDERS pv ON hs.Provider_ID = pv.Provider_ID
WHERE
      hs.Date >= '2024-10-01' AND hs.Date <= '2024-10-10'
ORDER BY
      pname.Last_name, pname.First_name;


-- Query 7: Create non-trivial SQL query that uses four tables in FROM clause
-- Purpose: This query retrieves a list of patients who have received recent alerts,
--          along with details about the specific alert and the associated provider.
-- Summary of Result: It shows the Patient's name, alert type, time of the alert, provider's name,
--          and any associated notes for monitoring purposes.

SELECT
    PATIENTS.First_name AS Patient_First_Name,
    PATIENTS.Last_name AS Patient_Last_Name,
    ALERTS.Alert_type AS Alert_Type,
    ALERTS.Time_stamp AS Alert_Time,
    PROVIDERS.First_name AS Provider_First_Name,
    PROVIDERS.Last_name AS Provider_Last_Name,
    HEALTH_SUMMARY.Provider_notes AS Provider_Notes
FROM
    PATIENTS
        JOIN
    ALERTS ON PATIENTS.Patient_ID = ALERTS.Patient_ID
        JOIN
    HEALTH_SUMMARY ON PATIENTS.Patient_ID = HEALTH_SUMMARY.Patient_ID
        JOIN
    PROVIDERS ON HEALTH_SUMMARY.Provider_ID = PROVIDERS.Provider_ID
WHERE
    ALERTS.Resolved = 'F';


-- Query 8: Create non-trivial SQL query that uses five tables in FROM clause Retrieve Patients Based on Age and Vital
--          Thresholds with Provider Info
-- Purpose: This query retrieves details of patients aged 65 and above who have at least one vital sign exceeding defined thresholds
--          along with the name of their healthcare provider.
-- Summary of Result: It returns the Patient ID, full name, age, vital signs exceeding thresholds, last check date,
--                    and the provider's name.

SELECT
    P.Patient_ID,
    P.First_name AS First_Name,
    P.Last_name AS Last_Name,
    P.Age,
    V.BLOOD_PRESSURE,
    V.HEART_RATE,
    V.BODY_TEMPERATURE,
    V.OXYGEN_SATURATION,
    V.BREATHING_RATE,
    HS.Date AS Last_Check_Date,
    PR.First_name AS Provider_First_Name,
    PR.Last_name AS Provider_Last_Name
FROM
    PATIENTS P
        JOIN VITALS V ON P.Patient_ID = V.PATIENT_ID
        JOIN HEALTH_SUMMARY HS ON P.Patient_ID = HS.Patient_ID
        JOIN PROVIDERS PR ON HS.Provider_ID = PR.Provider_ID
WHERE
    P.Age >= 65
  AND (
    EXISTS (SELECT 1 FROM VITAL_THRESHOLDS VT WHERE VT.Vital_category = 'Blood Pressure' AND
        (V.BLOOD_PRESSURE < VT.Minimum_value OR V.BLOOD_PRESSURE > VT.Maximum_value))
        OR EXISTS (SELECT 1 FROM VITAL_THRESHOLDS VT WHERE VT.Vital_category = 'Heart Rate' AND
        (V.HEART_RATE < VT.Minimum_value OR V.HEART_RATE > VT.Maximum_value))
        OR EXISTS (SELECT 1 FROM VITAL_THRESHOLDS VT WHERE VT.Vital_category = 'Body Temperature' AND
        (V.BODY_TEMPERATURE < VT.Minimum_value OR V.BODY_TEMPERATURE > VT.Maximum_value))
        OR EXISTS (SELECT 1 FROM VITAL_THRESHOLDS VT WHERE VT.Vital_category = 'Oxygen Saturation' AND
        (V.OXYGEN_SATURATION < VT.Minimum_value OR V.OXYGEN_SATURATION > VT.Maximum_value))
        OR EXISTS (SELECT 1 FROM VITAL_THRESHOLDS VT WHERE VT.Vital_category = 'Breathing Rate' AND
        (V.BREATHING_RATE < VT.Minimum_value OR V.BREATHING_RATE > VT.Maximum_value))
    );




-- Query 9: Create non-trivial SQL query using nine tables in FROM clause
-- Purpose: This query retrieves detailed patient information related to their patch devices and vital signs, as well
--          as associated alerts and healthcare provider interactions. It aggregates data to analyze each patient's health status
--          and the responsiveness of the healthcare system. The goal is to provide a comprehensive overview of the patient’s medical
--          situation and related activities.
-- Summary of Result: The query returns the unique Patient_ID along with the full Patient_Name and Medical_history. It includes current
--          readings from the patch device, vital signs such as Blood Pressure, Heart Rate, and Oxygen Saturation, as well as aggregated
--          counts of alerts, emergency dispatches, and provider messages. Additionally, it provides average blood pressure readings, minimum
--          oxygen saturation, and counts of test results and resolved alerts, offering a view of the patient's healthcare journey.
-- This query retrieves patient information along with their vital signs,
-- device readings, alert counts, and other relevant metrics.
SELECT
    PATCH_DEVICE.Patient_ID,
    PATIENTS.First_name AS Patient_First_Name,
    PATIENTS.Last_name AS Patient_Last_Name,
    PATIENTS.Medical_history,
    PATCH_DEVICE.Vital_Status AS Device_Reading,
    PATCH_DEVICE.Patch_Status,
    VITALS.BLOOD_PRESSURE,
    VITALS.HEART_RATE,
    VITALS.OXYGEN_SATURATION,
    COUNT(DISTINCT ALERTS.Alert_ID) AS Total_Alerts,
    COUNT(DISTINCT EMERGENCY_DISPATCH.Dispatch_time) AS Emergency_Dispatches,
    COUNT(DISTINCT MESSAGES.Message_Content) AS Provider_Messages,
    AVG(VITALS.BLOOD_PRESSURE) AS Avg_BP,
    MIN(VITALS.OXYGEN_SATURATION) AS Min_O2,
    COUNT(DISTINCT TEST_RESULTS.Result) AS Test_Count,
    COUNT(DISTINCT TEST_RESULTS.Result) AS Test_Outcomes,
    COUNT(DISTINCT PROVIDERS.Provider_ID) AS Providers_Involved,
    SUM(ALERTS.RESOLVED = 'T') AS Resolved_Alerts
FROM
    PATCH_DEVICE
        JOIN PATIENTS ON PATCH_DEVICE.Patient_ID = PATIENTS.Patient_ID
        JOIN VITALS ON PATIENTS.Patient_ID = VITALS.PATIENT_ID
        LEFT JOIN ALERTS ON PATCH_DEVICE.Patient_ID = ALERTS.PATIENT_ID
        LEFT JOIN EMERGENCY_DISPATCH ON ALERTS.Alert_ID = EMERGENCY_DISPATCH.Alert_ID
        LEFT JOIN MESSAGES ON PATIENTS.Patient_ID = MESSAGES.Sender_ID
        LEFT JOIN TEST_RESULTS ON PATIENTS.Patient_ID = TEST_RESULTS.Patient_ID
        LEFT JOIN HEALTH_SUMMARY ON PATIENTS.Patient_ID = HEALTH_SUMMARY.Patient_ID
        LEFT JOIN PROVIDERS ON HEALTH_SUMMARY.Provider_ID = PROVIDERS.Provider_ID
GROUP BY
    PATCH_DEVICE.Patient_ID,
    PATIENTS.First_name,
    PATIENTS.Last_name,
    PATIENTS.Medical_history,
    PATCH_DEVICE.Vital_Status,
    PATCH_DEVICE.Patch_Status,
    VITALS.BLOOD_PRESSURE,
    VITALS.HEART_RATE,
    VITALS.OXYGEN_SATURATION
HAVING
    COUNT(DISTINCT ALERTS.Alert_ID) > 0
ORDER BY
    COUNT(DISTINCT EMERGENCY_DISPATCH.Dispatch_time) DESC,
    MIN(VITALS.OXYGEN_SATURATION) ASC;





-- SQL Query 10: Create your own non-trivial SQL query, must use at least three tables in FROM clause must use aliasing
--               or renaming for at least once throughout SQL query.
-- Purpose: To identify patients with active patch devices who have unresolved high alerts. The query also retrieves details about
--          the exceeded vital signs, assigned provider, and emergency dispatch actions taken.
-- Summary of Result: The query returns a result set with the following columns:
--                    PatientID: Unique identifier of the patient.
--                    Patient_Name: Full name of the patient.
--                    Most_Recent_Alert_Timestamp: Timestamp of the latest unresolved high alert.
--                    Exceeded_Critical_Vitals: Comma-separated list of vital signs that have exceeded their normal thresholds.
--                    Patch_Status: Current status of the patient's patch device.
--                    Provider_Name: Name of the assigned provider, or "No Provider Assigned" if none.
--                    Dispatch_Time: Timestamp of the emergency dispatch action.
--                    Dispatch_Status: Status of the emergency dispatch action.

SELECT
    P.Patient_ID AS PatientID,
    CONCAT(P.First_name, ' ', P.Last_name) AS Patient_Name,
    MAX(A.TIME_STAMP) AS Most_Recent_Alert_Timestamp,
    GROUP_CONCAT(DISTINCT
                 CASE
                     WHEN V.BLOOD_PRESSURE > (SELECT Maximum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Blood Pressure' AND Vital_level = 'BP_Normal')
                         OR V.BLOOD_PRESSURE < (SELECT Minimum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Blood Pressure' AND Vital_level = 'BP_Normal')
                         THEN 'Blood Pressure'
                     WHEN V.HEART_RATE > (SELECT Maximum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Heart Rate' AND Vital_level = 'HR_Normal')
                         OR V.HEART_RATE < (SELECT Minimum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Heart Rate' AND Vital_level = 'HR_Normal')
                         THEN 'Heart Rate'
                     WHEN V.BODY_TEMPERATURE > (SELECT Maximum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Body Temperature' AND Vital_level = 'BT_Low')
                         OR V.BODY_TEMPERATURE < (SELECT Minimum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Body Temperature' AND Vital_level = 'BT_Low')
                         THEN 'Body Temperature'
                     WHEN V.OXYGEN_SATURATION > (SELECT Maximum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Oxygen Saturation' AND Vital_level = 'OS_Normal')
                         OR V.OXYGEN_SATURATION < (SELECT Minimum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Oxygen Saturation' AND Vital_level = 'OS_Normal')
                         THEN 'Oxygen Saturation'
                     WHEN V.BREATHING_RATE > (SELECT Maximum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Breathing Rate' AND Vital_level = 'BR_High')
                         OR V.BREATHING_RATE < (SELECT Minimum_value FROM VITAL_THRESHOLDS WHERE Vital_category = 'Breathing Rate' AND Vital_level = 'BR_High')
                         THEN 'Breathing Rate'
                     END
                 ORDER BY 1 ASC) AS Exceeded_Critical_Vitals,
    PD.Patch_Status AS Patch_Status,
    IFNULL(CONCAT(PR.First_name, ' ', PR.Last_name), 'No Provider Assigned') AS Provider_Name,
    ED.Dispatch_time AS Dispatch_Time,
    ED.Status AS Dispatch_Status
FROM
    PATIENTS P
        JOIN ALERTS A ON P.Patient_ID = A.PATIENT_ID
        JOIN PATCH_DEVICE PD ON P.Patient_ID = PD.Patient_ID
        LEFT JOIN HEALTH_SUMMARY HS ON P.Patient_ID = HS.Patient_ID
        LEFT JOIN PROVIDERS PR ON HS.Provider_ID = PR.Provider_ID
        LEFT JOIN EMERGENCY_DISPATCH ED ON A.ALERT_ID = ED.Alert_ID
        LEFT JOIN VITALS V ON P.Patient_ID = V.PATIENT_ID
WHERE
    A.ALERT_TYPE = 'HIGH'
  AND A.RESOLVED = 'F'
  AND PD.Patch_Status = 'Active'
GROUP BY
    P.Patient_ID, PD.Patch_Status, PR.Provider_ID, ED.Dispatch_time, ED.Status
ORDER BY
    Most_Recent_Alert_Timestamp DESC;

-- End of Script (Nov 08, 2024) **Revised according to the Revised Relational Schema Nov 21, 2024**



