const express = require('express');
const connectDb = require('./config/db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());



//database connection
connectDb();


// Routes

// super admin routes

const superRoutes = require('./routes/superAdminRoutes');
app.use('/api/superadmin', superRoutes);

// clinic admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin/clinics', adminRoutes);

// doctors routes

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/clinic/doctor', doctorRoutes);

// and the patient routes

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/clinic/patient', patientRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Dental Multi-Clinic API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
