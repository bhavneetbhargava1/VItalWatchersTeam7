/* ********************************
Project Phase II
Group 7 (MySQL)
This SQL Script was tested on
MySQL Workbench and hosted on IntelliJ.
To run, simply load this script file and execute while you have
a MySQL connection active.
******************************** */

-- ***************************
-- Part A: Database Schema Creation
-- ***************************

-- DATABASE: VitalWatchers
CREATE DATABASE vital_watchers;
USE vital_watchers;

-- TABLE: PATIENTS
-- Purpose: Stores details of patients including personal information and health status.
CREATE TABLE PATIENTS (
                          Patient_ID           INT AUTO_INCREMENT NOT NULL,
                          First_name           VARCHAR(50)        NOT NULL,
                          Last_name            VARCHAR(50)        NOT NULL,
                          Full_name            VARCHAR(100)       AS (CONCAT(First_name, ' ', Last_name)) STORED,
                          Age                  INT                NOT NULL CHECK (Age > 0 AND Age <= 120),
                          Patient_phone_num    VARCHAR(15)        DEFAULT 'Not Provided',
                          Medical_history      VARCHAR(100)       DEFAULT 'No history provided',
                          Patient_status       VARCHAR(20)        NOT NULL CHECK (Patient_status IN ('Healthy', 'Sick', 'Under Treatment')),
                          Patient_address      VARCHAR(100)       NOT NULL,
                          Gender               VARCHAR(10)        NOT NULL CHECK (Gender IN ('Male', 'Female')),
                          Email                VARCHAR(100)       NOT NULL,
                          PRIMARY KEY (Patient_ID),
                          UNIQUE (Email, Patient_phone_num)
);

-- TABLE: PROVIDERS
-- Purpose: Stores provider information, including contact details
CREATE TABLE PROVIDERS (
                           Provider_ID          INT AUTO_INCREMENT NOT NULL,
                           First_name           VARCHAR(50)        NOT NULL,
                           Last_name            VARCHAR(50)        NOT NULL,
                           Provider_phone_no    VARCHAR(15)        NOT NULL,
                           PRIMARY KEY (Provider_ID)
);

-- TABLE: HEALTH_SUMMARY
-- Purpose: Records health summaries for patients, including vital signs and provider notes.
CREATE TABLE HEALTH_SUMMARY (
                                Health_Summary_ID    INT AUTO_INCREMENT NOT NULL,
                                Patient_ID           INT                NOT NULL,
                                Date                 DATE               NOT NULL,
                                Vital_signs          VARCHAR(100)       DEFAULT 'No vitals',
                                Treatments           VARCHAR(100)       DEFAULT 'No treatments',
                                Provider_notes       VARCHAR(100)       DEFAULT 'No notes provided',
                                Provider_ID          INT                DEFAULT NULL,
                                PRIMARY KEY (Health_Summary_ID),
                                FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
                                FOREIGN KEY (Provider_ID) REFERENCES PROVIDERS(Provider_ID)
                                    ON DELETE SET NULL
                                    ON UPDATE CASCADE
);

-- TABLE: VITALS
-- Purpose: Stores patient vital information, including blood pressure, heart rate, body temperature,
--          oxygen saturation, and breathing rate. Each entry is timestamped.
CREATE TABLE VITALS (
                        Vital_ID            INT AUTO_INCREMENT NOT NULL,
                        Patient_ID          INT                NOT NULL,
                        Blood_pressure      DECIMAL(5, 2)      NOT NULL CHECK (Blood_pressure > 40 AND Blood_pressure < 250),
                        Heart_rate          DECIMAL(5, 2)      NOT NULL CHECK (Heart_rate > 30 AND Heart_rate < 200),
                        Body_temperature    DECIMAL(5, 2)      DEFAULT 98.6 NOT NULL CHECK (Body_temperature > 95 AND Body_temperature < 108),
                        Oxygen_saturation   DECIMAL(5, 2)      DEFAULT 100 NOT NULL CHECK (Oxygen_saturation > 80 AND Oxygen_saturation <= 100),
                        Breathing_rate      DECIMAL(5, 2)      DEFAULT 16 NOT NULL CHECK (Breathing_rate > 10 AND Breathing_rate < 40),
                        Time_stamp          DATETIME           NOT NULL,
                        D_trigger           INT                NOT NULL,
                        PRIMARY KEY (Vital_ID),
                        FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE
);

-- TABLE: VITAL_THRESHOLDS
-- Purpose: Stores threshold ranges for each vital category (e.g., blood pressure, heart rate)
--          to define normal and abnormal levels for alerts.
CREATE TABLE VITAL_THRESHOLDS (
                                  Thresholds_ID     INT AUTO_INCREMENT NOT NULL,
                                  Vital_category    VARCHAR(50)        NOT NULL,
                                  Vital_level       VARCHAR(50)        NOT NULL,
                                  Minimum_value     DECIMAL(5, 2)      NOT NULL,
                                  Maximum_value     DECIMAL(5, 2)      NOT NULL,
                                  PRIMARY KEY (Thresholds_ID),
                                  UNIQUE (Vital_category, Vital_level)
);

-- TABLE: PATCH_DEVICE
-- Purpose: Tracks wearable patch devices for each patient, including device status,
--          associated thresholds, and patient address for monitoring.
CREATE TABLE PATCH_DEVICE (
                              Device_ID            INT AUTO_INCREMENT NOT NULL,
                              Patient_ID           INT                NOT NULL,
                              Vital_status         VARCHAR(20),
                              Patch_status         VARCHAR(20)        NOT NULL CHECK (Patch_status IN ('Active', 'Inactive', 'Maintenance')),
                              Patient_address      VARCHAR(100)       NOT NULL,
                              Thresholds_ID        INT                DEFAULT NULL,
                              PRIMARY KEY (Device_ID),
                              FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                                  ON DELETE CASCADE
                                  ON UPDATE CASCADE,
                              FOREIGN KEY (Thresholds_ID) REFERENCES VITAL_THRESHOLDS(Thresholds_ID)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE
);

-- TABLE: ALERTS
-- Purpose: Records alerts generated for patients based on abnormal vital signs,
--          including alert type, timestamp, and resolution status.
CREATE TABLE ALERTS (
                        Alert_ID            INT AUTO_INCREMENT NOT NULL,
                        Patient_ID          INT                NOT NULL,
                        Alert_type          VARCHAR(10)        NOT NULL CHECK (Alert_type IN ('LOW', 'MEDIUM', 'HIGH', 'NORMAL', 'CRITICAL', 'ELEVATED')),
                        Time_stamp          DATETIME           NOT NULL,
                        Resolved            CHAR(1)            NOT NULL DEFAULT 'F',
                        Device_ID           INT                NOT NULL,
                        PRIMARY KEY (Alert_ID),
                        FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE,
                        FOREIGN KEY (Device_ID) REFERENCES PATCH_DEVICE(Device_ID)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE
);

-- TABLE: EMERGENCY_DISPATCH
-- Purpose: Manages dispatch records for emergency alerts, capturing details such as dispatch
--          time, arrival time, status, and associated patient details.
CREATE TABLE EMERGENCY_DISPATCH (
                                    Dispatch_ID        INT AUTO_INCREMENT NOT NULL,
                                    Patient_ID         INT                NOT NULL,
                                    Alert_ID           INT                NOT NULL,
                                    Dispatch_time      DATETIME           DEFAULT NULL,
                                    Arrival_time       DATETIME           DEFAULT NULL,
                                    Status             VARCHAR(20)        NOT NULL CHECK (Status IN ('Pending', 'Dispatched', 'Arrived', 'Resolved')),
                                    Notes              TEXT,
                                    PRIMARY KEY (Dispatch_ID),
                                    FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                                        ON DELETE CASCADE
                                        ON UPDATE CASCADE,
                                    FOREIGN KEY (Alert_ID) REFERENCES ALERTS(Alert_ID)
                                        ON DELETE CASCADE
                                        ON UPDATE CASCADE
);

-- TABLE: MESSAGES
-- Purpose: Stores messages related to patient health status, sent by providers, with each
--          message linked to a provider and timestamped.
CREATE TABLE MESSAGES (
                          Message_ID         INT AUTO_INCREMENT NOT NULL,
                          Message_content    TEXT               NOT NULL,
                          Time_sent          DATETIME           NOT NULL,
                          Sender_ID          INT                DEFAULT NULL,
                          PRIMARY KEY (Message_ID),
                          FOREIGN KEY (Sender_ID) REFERENCES PROVIDERS(Provider_ID)
                              ON DELETE SET NULL
                              ON UPDATE CASCADE
);

-- TABLE: USER_AUTHORIZATION
-- Purpose: Manages user access to the system, including their Patient_ID,
--          unique access code, and activation status.
CREATE TABLE USER_AUTHORIZATION (
                                    User_ID            INT AUTO_INCREMENT NOT NULL,
                                    Patient_ID         INT                NOT NULL,
                                    User_code          VARCHAR(10)        NOT NULL,
                                    Activation         BOOLEAN            DEFAULT FALSE,
                                    PRIMARY KEY (User_ID),
                                    FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                                        ON DELETE CASCADE
                                        ON UPDATE CASCADE
);

-- TABLE: TEST_RESULTS
-- Purpose: Logs test results for patients, linking them with providers, including test outcome and date.
CREATE TABLE TEST_RESULTS (
                              Test_result_ID     INT AUTO_INCREMENT NOT NULL,
                              Patient_ID         INT                NOT NULL,
                              Provider_ID        INT                DEFAULT NULL,
                              Alert_ID           INT                DEFAULT NULL,
                              Result             VARCHAR(100)       DEFAULT 'Pending',
                              Test_date          DATE               NOT NULL,
                              PRIMARY KEY (Test_result_ID),
                              FOREIGN KEY (Patient_ID) REFERENCES PATIENTS(Patient_ID)
                                  ON DELETE CASCADE
                                  ON UPDATE CASCADE,
                              FOREIGN KEY (Provider_ID) REFERENCES PROVIDERS(Provider_ID)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE,
                              FOREIGN KEY (Alert_ID) REFERENCES ALERTS(Alert_ID)
                                  ON DELETE SET NULL
                                  ON UPDATE CASCADE
);

DELIMITER //

CREATE TRIGGER trg_check_vitals
    AFTER INSERT ON VITALS
    FOR EACH ROW
BEGIN
    DECLARE min_bp, max_bp, min_hr, max_hr, min_temp, max_temp, min_oxy, max_oxy, min_breath, max_breath DECIMAL(5,2);

    -- Retrieve general thresholds for each vital category with the 'Normal' level
    SELECT Minimum_value, Maximum_value INTO min_bp, max_bp
    FROM VITAL_THRESHOLDS
    WHERE Vital_category = 'Blood Pressure' AND Vital_level = 'Normal';

    SELECT Minimum_value, Maximum_value INTO min_hr, max_hr
    FROM VITAL_THRESHOLDS
    WHERE Vital_category = 'Heart Rate' AND Vital_level = 'Normal';

    SELECT Minimum_value, Maximum_value INTO min_temp, max_temp
    FROM VITAL_THRESHOLDS
    WHERE Vital_category = 'Body Temperature' AND Vital_level = 'Normal';

    SELECT Minimum_value, Maximum_value INTO min_oxy, max_oxy
    FROM VITAL_THRESHOLDS
    WHERE Vital_category = 'Oxygen Saturation' AND Vital_level = 'Normal';

    SELECT Minimum_value, Maximum_value INTO min_breath, max_breath
    FROM VITAL_THRESHOLDS
    WHERE Vital_category = 'Breathing Rate' AND Vital_level = 'Normal';

    -- Check each vital and insert alerts if they exceed general thresholds
    IF NEW.Blood_pressure < min_bp OR NEW.Blood_pressure > max_bp THEN
        INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
        VALUES (NEW.Patient_ID, 'HIGH', NEW.Time_stamp, 'F', NEW.D_trigger);
    END IF;

    IF NEW.Heart_rate < min_hr OR NEW.Heart_rate > max_hr THEN
        INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
        VALUES (NEW.Patient_ID, 'HIGH', NEW.Time_stamp, 'F', NEW.D_trigger);
    END IF;

    IF NEW.Body_temperature < min_temp OR NEW.Body_temperature > max_temp THEN
        INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
        VALUES (NEW.Patient_ID, 'HIGH', NEW.Time_stamp, 'F', NEW.D_trigger);
    END IF;

    IF NEW.Oxygen_saturation < min_oxy OR NEW.Oxygen_saturation > max_oxy THEN
        INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
        VALUES (NEW.Patient_ID, 'HIGH', NEW.Time_stamp, 'F', NEW.D_trigger);
    END IF;

    IF NEW.Breathing_rate < min_breath OR NEW.Breathing_rate > max_breath THEN
        INSERT INTO ALERTS (Patient_ID, Alert_type, Time_stamp, Resolved, Device_ID)
        VALUES (NEW.Patient_ID, 'HIGH', NEW.Time_stamp, 'F', NEW.D_trigger);
    END IF;
END//

DELIMITER ;
