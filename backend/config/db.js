const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Do not crash the whole process here — server.js decides what to do
    // with a failed DB connection. Throwing lets the caller handle it.
    throw error;
  }
};

module.exports = connectDB;
