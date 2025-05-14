
const mongoose = require('mongoose');
require('dotenv').config(); 

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = { connectToDb };