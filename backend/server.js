require('dotenv').config({ path: './secrets/.env' });

const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Server config
const app = express();
const PORT = process.env.PORT || 5000;

// Body & cookie parsers, and express-fileupload
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());

// Morgan config
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);

// Deployment config route mount
app.use(deploymentRoutes);

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
