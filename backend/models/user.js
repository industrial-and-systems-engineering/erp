// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Counter = require('./counter.js'); // Import the counter model

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  userNumber: {
    type: Number,
    unique: true
  }
});

// Pre-save hook to assign a sequential userNumber to new users
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "userNumber" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      this.userNumber = counter.sequence_value;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
