// save this as dropOldIndex.js
const mongoose = require('mongoose');
require('dotenv').config();

async function dropoldindex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erpdevelopment');
    console.log('Connected to MongoDB');
    await mongoose.connection.collection('products').dropIndex('user_1_productNumber_1');
    console.log('Successfully dropped old index: user_1_productNumber_1');
    await mongoose.connection.collection('products').createIndex(
      { form: 1, productNumber: 1 }, 
      { unique: true }
    );
    console.log('Successfully created new index: form_1_productNumber_1');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

dropoldindex();