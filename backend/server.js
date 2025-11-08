const express = require('express');
const connectDb = require('./config/db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const addSuperAdmin = require("./models/superadmin");

// Middleware
app.use(express.json());


//dummy
const userModel = require("./models/user");

//database connection
connectDb();


// adding super admin to get all the access
addSuperAdmin();


// Routes

//authentication routes
const authRoutes = require("./routes/authRoutes");
app.use('/api/auth', authRoutes);

// super admin routes
const superRoutes = require('./routes/superAdminRoutes');
app.use('/api/superadmin', superRoutes);


// clinic admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/clinicadmin', adminRoutes);


// appointments routes 

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use('/api/appointment', appointmentRoutes);


// // doctors routes

// const doctorRoutes = require('./routes/doctorRoutes');
// app.use('/api/doctor', doctorRoutes);

// // and the patient routes

// const patientRoutes = require('./routes/patientRoutes');
// app.use('/api/patient', patientRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Dental Multi-Clinic API is running');
});

app.get('/userinfo', async (req, res) => {
    const data = await userModel.find();
    res.send(data);

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
