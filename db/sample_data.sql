-- ***************************
-- Part B: Sample Data Insertion
-- ***************************
USE vital_watchers;

-- Sample data for PATIENTS table
-- Summary: Inserts sample data for patients with various health conditions and statuses.
INSERT INTO PATIENTS (First_name, Last_name, Age, Patient_phone_num, Medical_history, Patient_status, Patient_address, Gender, Email)
VALUES
    ('John', 'Doe', 45, '555-1234', 'None', 'Healthy', '123 Main St', 'Male', 'john.doe@example.com'),
    ('Jane', 'Smith', 34, '555-5678', 'Asthma', 'Under Treatment', '456 Elm St', 'Female', 'jane.smith@example.com'),
    ('Alice', 'Johnson', 29, '555-8765', 'Diabetes', 'Sick', '789 Maple Ave', 'Female', 'alice.johnson@example.com'),
    ('Robert', 'Brown', 58, '555-4321', 'High Blood Pressure', 'Under Treatment', '101 Oak St', 'Male', 'robert.brown@example.com'),
    ('Linda', 'Davis', 65, '555-6543', 'Heart Disease', 'Sick', '202 Pine St', 'Female', 'linda.davis@example.com'),
    ('Michael', 'Wilson', 37, '555-2345', 'None', 'Healthy', '303 Cedar Ave', 'Male', 'michael.wilson@example.com'),
    ('Emily', 'Clark', 23, '555-7890', 'None', 'Healthy', '404 Birch Rd', 'Female', 'emily.clark@example.com'),
    ('David', 'Martinez', 40, '555-3456', 'Asthma', 'Under Treatment', '505 Maple St', 'Male', 'david.martinez@example.com'),
    ('Jessica', 'Lee', 30, '555-5679', 'None', 'Healthy', '606 Palm Dr', 'Female', 'jessica.lee@example.com'),
    ('Daniel', 'Taylor', 50, '555-6789', 'Diabetes', 'Sick', '707 Spruce St', 'Male', 'daniel.taylor@example.com'),
    ('George', 'Anderson', 55, '555-9876', 'Hypertension', 'Sick', '808 Oak St', 'Male', 'george.anderson@example.com'),
    ('Samantha', 'Clark', 42, '555-8765', 'Arrhythmia', 'Under Treatment', '909 Maple St', 'Female', 'samantha.clark@example.com'),
    ('Lisa', 'Roberts', 39, '555-7654', 'Fever', 'Sick', '1010 Cedar Ave', 'Female', 'lisa.roberts@example.com'),
    ('Brian', 'Nelson', 47, '555-6543', 'Asthma', 'Under Treatment', '1111 Birch Rd', 'Male', 'brian.nelson@example.com'),
    ('Nancy', 'Carter', 60, '555-5432', 'COPD', 'Sick', '1212 Palm Dr', 'Female', 'nancy.carter@example.com');

-- Sample data for PROVIDERS table
-- Summary: Inserts sample provider data, including provider names and contact numbers
INSERT INTO PROVIDERS (First_name, Last_name, Provider_phone_no)
VALUES
    ('Dr. Adam', 'Carter', '555-1122'),
    ('Dr. Emily', 'Parker', '555-3344'),
    ('Dr. Michael', 'White', '555-5566'),
    ('Dr. Sarah', 'Green', '555-7788'),
    ('Dr. Laura', 'Collins', '555-9900'),
    ('Dr. Robert', 'Scott', '555-2233'),
    ('Dr. Linda', 'Brown', '555-4455'),
    ('Dr. James', 'Wilson', '555-6677'),
    ('Dr. Maria', 'Rodriguez', '555-8899'),
    ('Dr. Andrew', 'Kim', '555-0011');

-- Sample data for HEALTH_SUMMARY table
-- Summary: Stores health summary records for patients, including vitals, treatments, and provider notes.
INSERT INTO HEALTH_SUMMARY (Patient_ID, Date, Vital_signs, Treatments, Provider_notes, Provider_ID)
VALUES
    (1, '2024-10-01', 'BP_Normal', 'Daily medication', 'Stable', 1),
    (2, '2024-10-02', 'BP_Critical', 'Dietary changes', 'Monitor regularly', 2),
    (3, '2024-10-03', 'BP_High', 'Medication adjustment', 'Monitor BP closely', 3),
    (4, '2024-10-04', 'BP_Normal', 'None', 'Stable BP', 4),
    (5, '2024-10-05', 'BP_Critical', 'Oxygen therapy', 'Improving', 5),
    (6, '2024-10-06', 'BP_Elevated', 'Diet modifications', 'Regular check needed', 6),
    (7, '2024-10-07', 'BP_Normal', 'Exercise adjustments', 'Follow-up suggested', 7),
    (8, '2024-10-08', 'OS_Low', 'None', 'Regular oxygen check needed', 8),
    (9, '2024-10-09', 'BP_Critical', 'Blood pressure meds', 'High risk monitoring', 9),
    (10, '2024-10-10', 'BT_Mild Fever', 'Antipyretics', 'Check for fever spikes', 10),
    (11, '2024-10-14', 'BT_High Fever', 'Immediate intervention', 'Monitor closely', 2),
    (12, '2024-10-14', 'BP_High', 'Diet control', 'Needs follow-up', 5),
    (13, '2024-10-14', 'BP_Normal', 'Normal vitals', 'Stable condition', 6),
    (14, '2024-10-14', 'OS_Low', 'Oxygen therapy', 'Improving slowly', 7),
    (15, '2024-10-14', 'BP_Critical', 'High BP treatment', 'Ongoing monitoring', 8);

-- VITALS table
-- Purpose: Stores patient vital information, including blood pressure, heart rate, body temperature,
--          oxygen saturation, and breathing rate. Each entry is timestamped and linked to a device.
INSERT INTO VITALS (Patient_ID, Blood_pressure, Heart_rate, Body_temperature, Oxygen_saturation, Breathing_rate, Time_stamp, D_trigger)
VALUES
    (1, 120.5, 80.0, 98.6, 98.0, 16.0, '2024-10-01 08:00:00', 1),
    (2, 190.0, 90.0, 98.2, 96.0, 18.0, '2024-10-02 09:00:00', 2),
    (3, 130.0, 95.0, 98.4, 94.0, 17.0, '2024-10-03 07:30:00', 3),
    (4, 125.0, 82.0, 98.3, 95.5, 15.0, '2024-10-04 10:00:00', 4),
    (5, 185.0, 92.0, 98.1, 93.0, 20.0, '2024-10-05 11:00:00', 5),
    (6, 135.0, 78.0, 98.7, 98.5, 16.5, '2024-10-06 08:45:00', 6),
    (7, 120.0, 75.0, 98.2, 97.0, 16.0, '2024-10-07 07:00:00', 7),
    (8, 105.0, 88.0, 98.4, 92.0, 17.5, '2024-10-08 06:30:00', 8),
    (9, 160.0, 85.0, 98.0, 97.5, 20.0, '2024-10-09 08:15:00', 9),
    (10, 115.0, 100.0, 100.5, 95.0, 18.5, '2024-10-10 09:30:00', 10),
    (11, 140.0, 110.0, 101.6, 98.0, 21.0, '2024-10-14 10:00:00', 11),
    (12, 125.0, 85.0, 98.6, 96.5, 19.0, '2024-10-14 11:00:00', 12),
    (13, 118.5, 78.5, 99.2, 98.0, 17.0, '2024-10-14 12:00:00', 13),
    (14, 110.0, 80.0, 97.9, 85.0, 18.0, '2024-10-14 13:00:00', 14),
    (15, 145.0, 90.0, 98.3, 97.0, 22.0, '2024-10-14 14:00:00', 15);

-- VITAL_THRESHOLDS table
-- Purpose: Stores threshold ranges for each vital category (e.g., blood pressure, heart rate)
--          to define normal and abnormal levels for alerts.
INSERT INTO VITAL_THRESHOLDS (Vital_category, Vital_level, Minimum_value, Maximum_value)
VALUES
    ('Blood Pressure', 'BP_Normal', 90.0, 120.0),
    ('Blood Pressure', 'BP_Elevated', 121.0, 129.0),
    ('Blood Pressure', 'BP_High', 130.0, 139.0),
    ('Blood Pressure', 'BP_Very High', 140.0, 180.0),
    ('Blood Pressure', 'BP_Critical', 181.0, 250.0),
    ('Heart Rate', 'HR_Normal', 60.0, 100.0),
    ('Heart Rate', 'HR_Low', 30.0, 59.9),
    ('Heart Rate', 'HR_High', 101.0, 150.0),
    ('Heart Rate', 'HR_Critical', 151.0, 200.0),
    ('Body Temperature', 'BT_High Fever', 100.5, 103.0),
    ('Body Temperature', 'BT_Low', 89.0, 96.9),
    ('Oxygen Saturation', 'OS_Normal', 95.0, 100.0),
    ('Oxygen Saturation', 'OS_Low', 90.0, 94.9),
    ('Oxygen Saturation', 'OS_Critical', 80.0, 89.9),
    ('Breathing Rate', 'BR_High', 20.1, 30.0),
    ('Breathing Rate', 'BR_Critical', 30.1, 40.0);

-- PATCH_DEVICE table
-- Purpose: Tracks wearable patch devices for each patient, including device status,
--          associated thresholds, and patient address for monitoring.
INSERT INTO PATCH_DEVICE (Patient_ID, Patient_address, Vital_status, Patch_status, Thresholds_ID)
VALUES
    (1, '123 Main St', 'BP_Normal', 'Active', 1),
    (2, '456 Elm St', 'BP_Critical', 'Active', 5),
    (3, '789 Maple Ave', 'BP_High', 'Maintenance', 3),
    (4, '101 Oak St', 'BP_Normal', 'Active', 1),
    (5, '202 Pine St', 'BP_Critical', 'Inactive', 5),
    (6, '303 Cedar Ave', 'BP_Elevated', 'Maintenance', 2),
    (7, '404 Birch Rd', 'BP_Normal', 'Active', 1),
    (8, '505 Maple St', 'OS_Low', 'Inactive', 6),
    (9, '606 Palm Dr', 'BP_Critical', 'Active', 5),
    (10, '707 Spruce St', 'BT_Mild Fever', 'Maintenance', 7),
    (11, '808 Oak St', 'BT_High Fever', 'Active', 4),
    (12, '909 Maple St', 'BP_High', 'Inactive', 3),
    (13, '1010 Cedar Ave', 'BP_Normal', 'Active', 1),
    (14, '1111 Birch Rd', 'OS_Low', 'Maintenance', 6),
    (15, '1212 Palm Dr', 'BP_Critical', 'Active', 5);

-- ALERTS table
-- Purpose: Records alerts generated for patients based on abnormal vital signs,
--          including alert type, timestamp, and resolution status.
INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
VALUES
    (1, 'NORMAL', '2024-10-04 10:00:00', 'F', 1),
    (2, 'CRITICAL', '2024-10-05 11:30:00', 'F', 2),
    (3, 'NORMAL', '2024-10-06 08:45:00', 'T', 3),
    (4, 'HIGH', '2024-10-07 07:00:00', 'F', 4),
    (5, 'ELEVATED', '2024-10-08 06:30:00', 'T', 5),
    (6, 'NORMAL', '2024-10-09 08:15:00', 'F', 6),
    (7, 'HIGH', '2024-10-10 09:30:00', 'F', 7),
    (8, 'NORMAL', '2024-10-11 08:00:00', 'T', 8),
    (9, 'ELEVATED', '2024-10-12 09:30:00', 'T', 9),
    (10, 'HIGH', '2024-10-13 10:30:00', 'F', 10),
    (11, 'HIGH', '2024-10-14 10:00:00', 'F', 11),
    (12, 'HIGH', '2024-10-14 11:00:00', 'F', 12),
    (13, 'HIGH', '2024-10-14 12:00:00', 'F', 13),
    (14, 'HIGH', '2024-10-14 13:00:00', 'F', 14),
    (15, 'HIGH', '2024-10-14 14:00:00', 'F', 15);

-- EMERGENCY_DISPATCH table
-- Purpose: Manages dispatch records for emergency alerts, capturing details such as dispatch
--          time, arrival time, status, and associated patient details.
INSERT INTO EMERGENCY_DISPATCH (Patient_ID, Alert_ID, Dispatch_time, Arrival_time, Status, Notes)
VALUES
    (1, 1, '2024-10-04 10:05:00', '2024-10-04 10:30:00', 'Arrived', 'Emergency handled'),
    (2, 2, '2024-10-05 11:35:00', NULL, 'Pending', 'Awaiting dispatch'),
    (3, 3, '2024-10-06 08:15:00', '2024-10-06 08:45:00', 'Arrived', 'Patient stabilized'),
    (4, 4, '2024-10-07 07:20:00', '2024-10-07 07:45:00', 'Arrived', 'Patient transported to ER'),
    (5, 5, '2024-10-08 06:00:00', '2024-10-08 06:25:00', 'Arrived', 'Patient received oxygen therapy'),
    (6, 6, '2024-10-09 09:45:00', NULL, 'Pending', 'Dispatch in progress'),
    (7, 7, '2024-10-10 09:00:00', '2024-10-10 09:30:00', 'Arrived', 'Patient received medication'),
    (8, 8, '2024-10-11 08:20:00', NULL, 'Pending', 'Dispatch delayed due to traffic'),
    (9, 9, '2024-10-12 07:15:00', '2024-10-12 07:50:00', 'Arrived', 'Patient stabilized on scene'),
    (10, 10, '2024-10-13 10:10:00', '2024-10-13 10:40:00', 'Arrived', 'Patient transported to hospital'),
    (11, 11, '2024-10-14 10:10:00', '2024-10-14 10:35:00', 'Arrived', 'Patient stabilized'),
    (12, 12, '2024-10-14 11:15:00', '2024-10-14 11:40:00', 'Arrived', 'Critical heart rate managed'),
    (13, 13, '2024-10-14 12:05:00', NULL, 'Pending', 'Awaiting arrival'),
    (14, 14, '2024-10-14 13:10:00', NULL, 'Pending', 'Dispatch in progress'),
    (15, 15, '2024-10-14 14:15:00', NULL, 'Pending', 'Dispatch in progress');

-- MESSAGES table
-- Purpose: Stores messages related to patient health status, sent by providers, with each
--          message linked to a provider and timestamped.
INSERT INTO MESSAGES (Message_content, Time_sent, Sender_ID)
VALUES
    ('Patient with BP_Normal readings; patch is active and functioning normally.', '2024-10-01 08:00:00', 1),
    ('Patient experiencing BP_Critical levels; patch inactive. Urgent review required.', '2024-10-02 09:00:00', 2),
    ('Patient with BP_High levels; patch under maintenance. Monitor closely.', '2024-10-03 10:00:00', 3),
    ('Patient readings stable at BP_Normal; patch is active.', '2024-10-04 11:00:00', 4),
    ('BP_Critical levels detected; patch inactive. Medical response advised.', '2024-10-05 12:00:00', 5),
    ('Patient with BP_Elevated levels; patch is under maintenance.', '2024-10-06 13:00:00', 6),
    ('Patient readings normal with BP_Normal levels; patch is active.', '2024-10-07 14:00:00', 7),
    ('Oxygen saturation low (OS_Low); patch is inactive. Follow-up needed.', '2024-10-08 15:00:00', 8),
    ('BP_Critical readings; patch active and alerting appropriately.', '2024-10-09 16:00:00', 9),
    ('Mild fever detected (BT_Mild Fever); patch is under maintenance. Monitor symptoms.', '2024-10-10 17:00:00', 10),
    ('Patient with high fever (BT_High Fever); patch is active. Medical intervention suggested.', '2024-10-11 18:00:00', 1),
    ('Patient at BP_High levels; patch inactive. Check alternative monitoring.', '2024-10-12 19:00:00', 2),
    ('Normal BP levels detected; patch is active.', '2024-10-13 20:00:00', 3),
    ('Low oxygen saturation (OS_Low); patch under maintenance. Additional monitoring required.', '2024-10-14 21:00:00', 4),
    ('Patient with BP_Critical levels; patch is active. Emergency alert sent.', '2024-10-15 22:00:00', 5);

-- USER_AUTHORIZATION table
-- Purpose: Manages user access to the system, including their email, phone number,
--          unique access code, and activation status.
INSERT INTO USER_AUTHORIZATION (Patient_ID, User_code, Activation)
VALUES
    (1, 'A1234', TRUE),
    (2, 'B5678', FALSE),
    (3, 'C9101', TRUE),
    (4, 'D1123', TRUE),
    (5, 'E1415', FALSE),
    (6, 'F1617', TRUE),
    (7, 'G1819', FALSE),
    (8, 'H2021', TRUE),
    (9, 'I2223', TRUE),
    (10, 'J2425', FALSE),
    (11, 'K3031', TRUE),
    (12, 'L3233', FALSE),
    (13, 'M3435', TRUE),
    (14, 'N3637', FALSE),
    (15, 'O3839', TRUE);

-- TEST_RESULTS table
-- Purpose: Logs test results for patients, linking them with alerts and providers,
--          including test outcome and date.
INSERT INTO TEST_RESULTS (Patient_ID, Provider_ID, Alert_ID, Result, Test_date)
VALUES
    (1, 1, 1, 'Positive', '2024-10-01'),
    (2, 2, 2, 'Negative', '2024-10-02'),
    (3, 3, 3, 'Pending', '2024-10-03'),
    (4, 4, 4, 'Positive', '2024-10-04'),
    (5, 5, 5, 'Negative', '2024-10-05'),
    (6, 6, 6, 'Inconclusive', '2024-10-06'),
    (7, 7, 7, 'Pending', '2024-10-07'),
    (8, 8, 8, 'Positive', '2024-10-08'),
    (9, 9, 9, 'Negative', '2024-10-09'),
    (10, 10, 10, 'Inconclusive', '2024-10-10'),
    (11, 1, 11, 'Positive', '2024-10-11'),
    (12, 2, 12, 'Negative', '2024-10-12'),
    (13, 3, 13, 'Pending', '2024-10-13'),
    (14, 4, 14, 'Positive', '2024-10-14'),
    (15, 5, 15, 'Negative', '2024-10-15');
