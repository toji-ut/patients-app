
const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/userdata', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = { connectToDb };