require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const initialDataRoutes = require('./routes/admin/initialData');
const pageRoutes = require('./routes/admin/page');
const userAddressROutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const adminOrderRoutes = require('./routes/admin/order');

// Configurations
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', pageRoutes);
app.use('/api', userAddressROutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB ...'))
    .catch(err => console.log(err.message));

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});