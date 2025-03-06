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

  usertype:{
    type:String
  },
  userNumber: {
    type: Number,
    unique: true
  }
});

//presave hooks used for doing any operation before saving this scheam to database
//ypu can access information that comes here using this keyword
//this.isNew is used to check if the document is new or not
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