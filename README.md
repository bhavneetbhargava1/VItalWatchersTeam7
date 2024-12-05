# VitalWatchersTeam7

## Overview
The **Vital Watchers** project is a telehealth and remote patient monitoring application designed to track key vitals such as:
- Blood Pressure
- Heart Rate
- Body Temperature
- Oxygen Saturation
- Breathing Rate

The application alerts users when vitals exceed defined thresholds, enhancing healthcare management for patients.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed before setting up the application:
- **Node.js** (v14 or later) - [Download Node.js](https://nodejs.org/)
- **MySQL** (v8.0 or later) - [Download MySQL](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download Git](https://git-scm.com/)
- **npm** (bundled with Node.js)
- A code editor like **IntelliJ or VSCode** 

---

### Installation Steps

#### 1.Open the Repository
Clone the repository to your local machine

#### 2. Install Dependencies
Run the following command to install all necessary dependencies:

npm install
```

#### 3. Configure Environment Variables
Edit the `.env` file in the root directory and add the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vital_watchers
PORT=3306
```
Replace `your_password` with your MySQL root password.

#### 4. Set Up the Database
Place MySQL scripts in the `db` folder
and make sure a database connection is made to the MySQL server, this can be done with
MySQL Workbench or any other MySQL client, but make sure that connection is made. 
```
This will create the necessary tables and populate them with initial data if you run the scripts.

#### 5. Start the Application
To start the server, use the following command:
npm start
```
The application will run on `http://localhost:5000`.

---

### Usage
Once the server is running, you can access the application using your web browser by navigating to `http://localhost:5000'.

- **Login** with one of the following credentials once promted to the website:
  -  Patient Email: john.doe@example.com, User Code: A1234
  -  Patient Email: jane.smith@example.com, User Code: B5678
  -  Patient Email: alice.johnson@example.com, User Code: C9101
  -  Patient Email: robert.brown@example.com, User Code: D1123
  -  Patient Email: linda.davis@example.com, User Code: E1415
  -  Patient Email: michael.wilson@example.com, User Code: F1617
  -  Patient Email: emily.clark@example.com, User Code: G1819
  -  Patient Email: david.martinez@example.com, User Code: H2021
  -  Patient Email: jessica.lee@example.com, User Code: I2223
  -  Patient Email: daniel.taylor@example.com, User Code: J2425
  -  Patient Email: george.anderson@example.com, User Code: K3031
  -  Patient Email: samantha.clark@example.com, User Code: L3233
  -  Patient Email: lisa.roberts@example.com, User Code: M3435
  -  Patient Email: brian.nelson@example.com, User Code: N3637
  -  Patient Email: nancy.carter@example.com, User Code: O3839


---

### Troubleshooting
- If you encounter issues connecting to the database, ensure your `.env` variables are set correctly and that MySQL is running.
- For missing dependencies or unexpected errors, try running `npm install` again and also look at package.json to make
- make sure all the dependencies are downloaded.

---

### Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript

---

### Contributors
- Bhavneet Bhargava
- Binal Dhaliwal
- Anagha Krishna

---

