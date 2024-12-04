const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

router.get('/emergency-dispatch-summary', async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                ED.Dispatch_ID,
                ED.Patient_ID,
                ED.Alert_ID,
                ED.Dispatch_time,
                ED.Arrival_time,
                ED.Status AS Dispatch_Status,
                ED.Notes AS Dispatch_Notes,
                P.First_name,
                P.Last_name,
                P.Full_name AS Patient_Name,
                P.Age AS Patient_Age,
                P.Medical_history,
                P.Patient_phone_num,
                P.Patient_address,
                A.Alert_type,
                A.Time_stamp AS Alert_Time,
                PD.Vital_status,
                PD.Patch_status,
                V.Blood_pressure,
                V.Heart_rate,
                V.Body_temperature,
                V.Oxygen_saturation,
                V.Breathing_rate,
                V.Time_stamp AS Vitals_Time
            FROM 
                EMERGENCY_DISPATCH AS ED
                JOIN PATIENTS AS P ON ED.Patient_ID = P.Patient_ID
                JOIN ALERTS AS A ON ED.Alert_ID = A.Alert_ID
                JOIN PATCH_DEVICE AS PD ON P.Patient_ID = PD.Patient_ID
                JOIN VITALS AS V ON P.Patient_ID = V.Patient_ID
            WHERE 
                V.Time_stamp = (
                    SELECT MAX(Time_stamp)
                    FROM VITALS V2
                    WHERE V2.Patient_ID = P.Patient_ID
                )
            ORDER BY 
                CASE ED.Status
                    WHEN 'Pending' THEN 1
                    WHEN 'Dispatched' THEN 2
                    WHEN 'Arrived' THEN 3
                    WHEN 'Resolved' THEN 4
                END,
                ED.Dispatch_time DESC;
        `;

        const [rows] = await db.query(sqlQuery);

        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Dispatch Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/sketchy/bootstrap.min.css">
    <style>
        :root {
            --royal-blue: #1d3557;
            --light-blue: #a8dadc;
            --cream: #f1faee;
            --medium-blue: #457b9d;
            --highlight-blue: #e6f3f5;
        }

        body {
            background-color: var(--cream);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .navbar {
            background: linear-gradient(135deg, var(--royal-blue), var(--medium-blue)) !important;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }

        .header-status {
            padding: 20px;
            color: white;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }

        .header-status h3 {
            margin-bottom: 10px;
        }

        .emergency-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
            border: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .emergency-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .emergency-card.pending {
            border-left: 5px solid #e74c3c;
        }

        .emergency-card.dispatched {
            border-left: 5px solid #f39c12;
        }

        .emergency-card.arrived {
            border-left: 5px solid #9b59b6;
        }

        .emergency-card.resolved {
            border-left: 5px solid #2ecc71;
        }

        .status-badge {
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            display: inline-block;
            min-width: 100px;
        }

        .status-badge.pending {
            background-color: #e74c3c;
            color: white;
        }

        .status-badge.dispatched {
            background-color: #f39c12;
            color: white;
        }

        .status-badge.arrived {
            background-color: #9b59b6;
            color: white;
        }

        .status-badge.resolved {
            background-color: #2ecc71;
            color: white;
        }

        .vitals-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .vital-box {
            background: var(--highlight-blue);
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s ease;
        }

        .vital-box:hover {
            transform: scale(1.02);
        }

        .vital-box h6 {
            color: var(--royal-blue);
            margin-bottom: 5px;
        }

        .vital-value {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--royal-blue);
        }

        .critical {
            color: #e74c3c;
        }

        .warning {
            color: #f39c12;
        }

        .normal {
            color: #2ecc71;
        }

        .timestamp {
            color: var(--medium-blue);
            font-size: 0.9rem;
        }

        .contact-info {
            background: var(--highlight-blue);
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--medium-blue);
            background: var(--highlight-blue);
            border-radius: 10px;
            margin: 2rem 0;
        }

        .alert-info {
            background: rgba(155, 89, 182, 0.1);
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
        }

        .footer {
            margin-top: auto;
            padding: 20px 0;
            background: var(--royal-blue);
            color: white;
        }

        @media (max-width: 768px) {
            .vitals-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">VitalWatchers</a>
            <div class="d-flex">
                <a class="nav-link text-white" href="/index.html">Home</a>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        <h1 class="text-center mb-4">Emergency Dispatch Dashboard</h1>
`;

        // Add status summary
        const statusCounts = {
            Pending: rows.filter(r => r.Dispatch_Status === 'Pending').length,
            Dispatched: rows.filter(r => r.Dispatch_Status === 'Dispatched').length,
            Arrived: rows.filter(r => r.Dispatch_Status === 'Arrived').length,
            Resolved: rows.filter(r => r.Dispatch_Status === 'Resolved').length
        };

        html += `
        <div class="row mb-4">
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="header-status" style="background-color: #e74c3c">
                    <h3>${statusCounts.Pending}</h3>
                    <p class="mb-0">Pending</p>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="header-status" style="background-color: #f39c12">
                    <h3>${statusCounts.Dispatched}</h3>
                    <p class="mb-0">Dispatched</p>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="header-status" style="background-color: #9b59b6">
                    <h3>${statusCounts.Arrived}</h3>
                    <p class="mb-0">Arrived</p>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="header-status" style="background-color: #2ecc71">
                    <h3>${statusCounts.Resolved}</h3>
                    <p class="mb-0">Resolved</p>
                </div>
            </div>
        </div>
`;

        if (rows.length === 0) {
            html += `
                <div class="empty-state">
                    <h3>No Emergency Dispatches Found</h3>
                    <p>There are currently no active emergency dispatch records in the system.</p>
                </div>
            `;
        } else {
            rows.forEach(dispatch => {
                const statusClass = dispatch.Dispatch_Status.toLowerCase();
                const dispatchTime = new Date(dispatch.Dispatch_time).toLocaleString();
                const arrivalTime = dispatch.Arrival_time ? new Date(dispatch.Arrival_time).toLocaleString() : 'Not arrived';
                const alertTime = new Date(dispatch.Alert_Time).toLocaleString();
                const vitalsTime = new Date(dispatch.Vitals_Time).toLocaleString();

                // Function to determine vital sign status
                const getVitalStatus = (type, value) => {
                    switch(type) {
                        case 'bp':
                            return value > 140 ? 'critical' : value > 120 ? 'warning' : 'normal';
                        case 'hr':
                            return value > 100 ? 'critical' : value < 60 ? 'warning' : 'normal';
                        case 'temp':
                            return value > 99.5 ? 'critical' : value < 97 ? 'warning' : 'normal';
                        case 'ox':
                            return value < 95 ? 'critical' : value < 97 ? 'warning' : 'normal';
                        case 'br':
                            return value > 20 ? 'critical' : value < 12 ? 'warning' : 'normal';
                        default:
                            return 'normal';
                    }
                };

                html += `
                    <div class="emergency-card ${statusClass}">
                        <div class="card-body">
                            <div class="row align-items-center mb-3">
                                <div class="col-md-6">
                                    <h5 class="card-title">Patient: ${dispatch.Patient_Name}</h5>
                                    <p class="mb-1">Age: ${dispatch.Patient_Age} | Medical History: ${dispatch.Medical_history}</p>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <span class="status-badge ${statusClass}">${dispatch.Dispatch_Status}</span>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="contact-info">
                                        <h6>Contact Information</h6>
                                        <p class="mb-1"><strong>Phone:</strong> ${dispatch.Patient_phone_num}</p>
                                        <p class="mb-0"><strong>Address:</strong> ${dispatch.Patient_address}</p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="alert-info">
                                        <h6>Alert Information</h6>
                                        <p class="mb-1"><strong>Alert Type:</strong> ${dispatch.Alert_type}</p>
                                        <p class="mb-0"><strong>Device Status:</strong> ${dispatch.Patch_status}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-3">
                                    <p><strong>Dispatch Time:</strong><br><span class="timestamp">${dispatchTime}</span></p>
                                </div>
                                <div class="col-md-3">
                                    <p><strong>Arrival Time:</strong><br><span class="timestamp">${arrivalTime}</span></p>
                                </div>
                                <div class="col-md-3">
                                    <p><strong>Alert Time:</strong><br><span class="timestamp">${alertTime}</span></p>
                                </div>
                                <div class="col-md-3">
                                    <p><strong>Vitals Updated:</strong><br><span class="timestamp">${vitalsTime}</span></p>
                                </div>
                            </div>

                            <div class="vitals-grid">
                                <div class="vital-box">
                                    <h6>Blood Pressure</h6>
                                    <p class="vital-value ${getVitalStatus('bp', dispatch.Blood_pressure)}">${dispatch.Blood_pressure} mmHg</p>
                                </div>
                                <div class="vital-box">
                                    <h6>Heart Rate</h6>
                                    <p class="vital-value ${getVitalStatus('hr', dispatch.Heart_rate)}">${dispatch.Heart_rate} bpm</p>
                                </div>
                                <div class="vital-box">
                                    <h6>Temperature</h6>
                                    <p class="vital-value ${getVitalStatus('temp', dispatch.Body_temperature)}">${dispatch.Body_temperature}°F</p>
                                </div>
                                <div class="vital-box">
                                    <h6>Oxygen Saturation</h6>
                                    <p class="vital-value ${getVitalStatus('ox', dispatch.Oxygen_saturation)}">${dispatch.Oxygen_saturation}%</p>
                                </div>
                                <div class="vital-box">
                                    <h6>Breathing Rate</h6>
                                    <p class="vital-value ${getVitalStatus('br', dispatch.Breathing_rate)}">${dispatch.Breathing_rate} bpm</p>
                                </div>
                            </div>

                            ${dispatch.Dispatch_Notes ? `
                                <div class="mt-3">
                                    <p><strong>Dispatch Notes:</strong> ${dispatch.Dispatch_Notes}</p>
                                </div>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        html += `
        </div>
    </div>

    <footer class="footer mt-auto">
        <div class="container text-center">
            <p class="mb-0">VitalWatchers © 2024 - Emergency Dispatch Monitor</p>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
</body>
</html>
        `;

        res.send(html);
    } catch (err) {
        console.error('Error retrieving emergency dispatch summary:', err.message);
        res.status(500).send(`
            <div class="alert alert-danger text-center">
                <h4 class="alert-heading">Error Loading Emergency Dispatch Data</h4>
                <p class="mb-0">Failed to retrieve emergency dispatch summary. Please try again later or contact system administrator.</p>
            </div>
        `);
    }
});

module.exports = router;