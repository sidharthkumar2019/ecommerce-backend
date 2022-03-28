require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');

// Configurations
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err.message));

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});