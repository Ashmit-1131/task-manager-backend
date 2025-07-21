
/**
 * Database Connection Module
 * --------------------------
 * This module handles connecting to the MongoDB database using Mongoose.
 * It loads the connection URI from environment variables and attempts to
 * establish a connection. If the connection fails, it logs the error and
 * exits the process to ensure the application does not run without a database.
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// MongoDB connection URI; defaults to a local database if not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

/**
 * connectDB
 * ----------
 * Attempts to connect to MongoDB using the provided URI.
 * On success, logs a confirmation message. On failure, logs the error message
 * and terminates the process with a non-zero exit code.

 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1); // exit the process with an error code
  }
};

module.exports = connectDB; // export the connection function for use in index.js
