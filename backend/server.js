const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose=require('mongoose')
// Middleware
app.use(express.json());


//mongodb connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));



// Routes
const clinicRoutes = require('./routes/clinicRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');

app.use('/clinic', clinicRoutes);
app.use('/clinic', doctorRoutes);
app.use('/clinic', patientRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Dental Multi-Clinic API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
