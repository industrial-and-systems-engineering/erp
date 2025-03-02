// models/Counter.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  _id: { type: String, required: true }, // Name of the counter, e.g., "userNumber"
  sequence_value: { type: Number, default: 0 }
});

module.exports = mongoose.model("Counter", counterSchema);
