const express = require('express');
const router = express.Router();
const db = require('../dbConfig');

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
                P.Medical_History AS Medical_History,
                HS.Date AS Last_Health_Check_Date,
                HS.Vital_signs AS Vital_Signs,
                HS.Treatments AS Treatments_Provided,
                HS.Provider_notes AS Provider_Notes,
                CONCAT(PR.First_name, ' ', PR.Last_name) AS Provider_Name
            FROM
                USER_AUTHORIZATION AS UA
                    JOIN PATIENTS AS P ON UA.Patient_ID = P.Patient_ID
                    JOIN HEALTH_SUMMARY AS HS ON P.Patient_ID = HS.Patient_ID
                    JOIN PROVIDERS AS PR ON HS.Provider_ID = PR.Provider_ID
            ORDER BY
                UA.Activation DESC,
                P.Full_name ASC,
                HS.Date DESC;
        `;

        const [rows] = await db.query(sqlQuery);

        // Begin HTML Response
        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Health Summary</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/sketchy/bootstrap.min.css">
    <style>
        :root {
            --royal-blue: #1d3557;
            --light-blue: #a8dadc;
            --cream: #f1faee;
            --medium-blue: #457b9d;
            --highlight-blue: #e6f3f5;
            --success-green: #4CAF50;
            --warning-orange: #ff9800;
            --danger-red: #f44336;
            --purple-accent: #9c27b0;
            --row-height: 60px;
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

        .navbar-brand {
            color: white !important;
            font-weight: bold;
            font-size: 1.5rem;
        }

        .nav-link {
            color: white !important;
            transition: all 0.3s ease;
        }

        .nav-link:hover {
            color: var(--light-blue) !important;
            transform: translateY(-2px);
        }

        .container {
            margin-top: 2rem;
            margin-bottom: 2rem;
        }

        /* Page Title */
        .page-title {
            color: var(--royal-blue);
            text-align: center;
            margin-bottom: 2rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        /* Table Styling */
        .table-container {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .table {
            border: none;
            margin-bottom: 0;
        }

        .table th {
            background: linear-gradient(135deg, var(--royal-blue), var(--medium-blue));
            color: white;
            border: none;
            padding: 15px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .table tbody tr {
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
            height: var(--row-height);
        }

        .table tbody tr:hover {
            background-color: var(--highlight-blue);
            transform: scale(1.01);
            border-left: 4px solid var(--royal-blue);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .table td {
            vertical-align: middle;
            padding: 15px;
        }

        /* Button Styling */
        .btn-primary {
            background: linear-gradient(135deg, var(--royal-blue), var(--medium-blue));
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            background: linear-gradient(135deg, var(--medium-blue), var(--royal-blue));
        }

        /* Footer styling */
        .footer {
            background: linear-gradient(135deg, var(--royal-blue), var(--medium-blue));
            color: white;
            padding: 1.5rem 0;
            margin-top: auto;
            box-shadow: 0 -2px 15px rgba(0,0,0,0.1);
        }

        /* Empty state styling */
        .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--medium-blue);
            background: var(--highlight-blue);
            border-radius: 10px;
            margin: 1rem 0;
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

<div class="container">
    <h1 class="page-title">Patient Authorization and Health Summary</h1>

    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Authorization</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Medical History</th>
                    <th>Vital Signs</th>
                    <th>Treatments</th>
                    <th>Provider Notes</th>
                    <th>Provider</th>
                    <th>Last Visit</th>
                </tr>
            </thead>
            <tbody>
`;

        if (rows.length === 0) {
            html += `
                <tr>
                    <td colspan="9" class="empty-state">
                        No matching patients found.
                    </td>
                </tr>`;
        } else {
            rows.forEach((patient, index) => {
                const statusClass = patient.Vital_Signs.includes('Critical') ? 'status-critical' :
                    patient.Vital_Signs.includes('High') ? 'status-warning' : 'status-active';

                html += `
                    <tr>
                        <td>
                            <button class="btn btn-sm btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">View Details</button>
                        </td>
                        <td><span class="status-indicator ${statusClass}"></span>${patient.Patient_Name}</td>
                        <td>${patient.Patient_Age}</td>
                        <td>${patient.Medical_History}</td>
                        <td>${patient.Vital_Signs}</td>
                        <td>${patient.Treatments_Provided}</td>
                        <td>${patient.Provider_Notes}</td>
                        <td>${patient.Provider_Name}</td>
                        <td>${new Date(patient.Last_Health_Check_Date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td colspan="9" class="p-0">
                            <div class="collapse" id="collapse${index}">
                                <div class="card card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <p><strong>User ID:</strong> ${patient.User_ID}</p>
                                            <p><strong>Patient ID:</strong> ${patient.Patient_ID}</p>
                                        </div>
                                        <div class="col-md-4">
                                            <p><strong>Authorization Code:</strong> ${patient.Authorization_Code}</p>
                                            <p><strong>Activation Status:</strong>
                                                <span class="badge ${patient.Is_Activated ? 'bg-success' : 'bg-danger'}">${patient.Is_Activated ? 'Active' : 'Inactive'}</span>
                                            </p>
                                        </div>
                                        <div class="col-md-4">
                                            <p><strong>Authorized Email:</strong> ${patient.Authorized_Email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        html += `
            </tbody>
        </table>
    </div>
</div>

<footer class="footer">
    <div class="container text-center">
        <p class="mb-0">VitalWatchers © 2024 - Remote Monitoring for Healthcare Providers</p>
    </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

        res.send(html);
    } catch (err) {
        console.error('Error retrieving patient authorization summary:', err.message);
        res.status(500).send(`
            <div class="alert alert-danger text-center">
                Failed to retrieve patient authorization summary. Please try again later.
            </div>
        `);
    }
});

module.exports = router;
