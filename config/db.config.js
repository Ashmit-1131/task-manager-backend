
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
 
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
