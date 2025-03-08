const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erpdevelopment', {})
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await mongoose.connection.collection('users').dropIndex('userNumber_1');
      console.log('Index dropped successfully');
    } catch (err) {
      console.error('Error dropping index:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));