const mongoose = require('mongoose')

require("dotenv").config();


const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Atlas connected'))
        .catch(err => console.error('MongoDB connection error:', err));

}

module.exports = connectDb;