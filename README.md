# 🦷 Dental Multi-Clinic Web Application (Backend)

A powerful and scalable **RESTful backend API** built using **Node.js, Express.js, and MongoDB**, designed to manage multiple dental clinics under one platform. Supports different roles including **Super Admin, Clinic Admin, Doctors, Patients** and provides functionalities for authentication, appointment booking, clinic management, prescriptions, and more.

---

## 🚀 Features

### 👑 Super Admin

* Create and manage clinics
* Assign clinic admins
* View all clinics
* Delete clinic

### 🏥 Clinic Admin

* Register Doctors & Patients
* View Doctors & Patients for their clinic
* Create Appointments for patients
* View all clinic appointments
* Update Appointment status
* Email notification for appointments

### 🧑‍⚕️ Doctor

* See related appointments
* Create and update prescriptions
* View own prescriptions
* View assigned patients

### 🧑 Patient

* Book appointments with doctor
* View own appointments
* View prescriptions given by doctors

---

## 🏗 Technology Stack

| Category          | Technology                      |
| ----------------- | ------------------------------- |
| Backend Framework | Express.js                      |
| Database          | MongoDB & Mongoose              |
| Authentication    | JWT                             |
| Middleware        | CORS, Role-based Access Control |
| Environment       | dotenv                          |

---

## 📁 Project Structure

```
backend/
│
├── config/
│   └── db.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── .env
├── server.js
└── package.json
```

---

## 🔐 Authentication & Authorization

Uses **JWT Token** stored in headers.
Role-based access with middleware:

```
roleAuthenticator(["superadmin", "clinicadmin", "doctor", "patient"])
```

---

## 📌 API Endpoints Summary

### **Auth Routes** `/api/auth`

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| POST   | `/login`  | Login user       |
| POST   | `/signup` | Register Patient |

### **Super Admin** `/api/superadmin`

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/clinics`     | Get all clinics       |
| GET    | `/clinics/:id` | Find clinic by ID     |
| POST   | `/clinic`      | Create clinic + admin |
| DELETE | `/clinics/:id` | Delete clinic         |

### **Clinic Admin** `/api/clinicadmin`

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| POST   | `/doctors`               | Add doctor              |
| POST   | `/patients`              | Add patient             |
| GET    | `/doctors`               | Show doctors            |
| GET    | `/patients`              | Show patients           |
| POST   | `/createAppointment/:id` | Create appointment      |
| GET    | `/getAppointments`       | All clinic appointments |

### **Doctor** `/api/doctor`
| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET  | `/appointment` | My appointments |
| POST | `/prescription/:id` | Create prescription |
| PUT  | `/prescription/:id` | Update prescription |
| GET  | `/patients` | My patients |
| GET  | `/prescriptions` | My prescriptions |

### **Patient** `/api/patient`
| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| POST | `/appointments/:id` | Book appointment |
| GET | `/appointments` | View booked appointments |
| GET | `/prescription` | View prescriptions |

### **Appointment (Common)** `/api/appointment`
| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| POST | `/` | Book appointment (user side) |
| GET | `/` | Get appointments (clinic admin) |
| PATCH | `/:id` | Update appointment |

---

## ⚙ Setup & Installation

### Prerequisites

* Node.js & npm
* MongoDB (local or Atlas)

### Installation Steps

```bash
git clone <repository-link>
cd backend
npm install
```

### Add ENV Variables

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
NodeMailerUsername
NodemailerPassword
```

### Run Server

```
npm start
```

Server runs on: `http://localhost:5000`

---

## 🧪 Testing

Use **Postman / Thunder Client** to test all secured endpoints.
Attach JWT token:

```
Authorization: Bearer <token>
```

---

## ✨ Future Improvements

* Payment gateway integration
* Real-time chat using socket.io
* Automation to accept and decline the appointment

---

## 🤝 Contributors

* **Priyanshu Pant** (Backend Developer)
* **Parth Verma** (Api intergation)
* **Ritesh Bhandari and  Gaurav Singh Negi** (Frontend Developer)



---

### ⭐ If you like this project, give it a Star on GitHub!
