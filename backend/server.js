const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {logger, logEvents} = require('./middleware/logger');
const error = require('./middleware/error');
const corsOptions = require('./config/corsOptions');
require('./config/db');
const app = express();

// establish the mongoDB connection


// log every request middleware
app.use(logger);

// CORS middleware
app.use(cors(corsOptions));

// cookie parser middleware
app.use(cookieParser());

// JSON body parser middleware
app.use(express.json({limit: '30mb'}));


// api routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// error handling middleware
app.use(error);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
