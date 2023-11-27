require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const deployment = require('./routes/deploymentRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Server config
const app = express();
const PORT = process.env.PORT || 5000;

// Body & cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

// Morgan config
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Deployment config route
app.use(deployment);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Connect database
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);

    // Run server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
