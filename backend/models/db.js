const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');


const ProductSchema = new Schema({
  jobNo: { type: String, required: true },
  instrumentDescription: { type: String, required: true },
  serialNo: { type: String, required: true },
  parameter: { type: String, required: true },
  ranges: { type: String, required: true },
  accuracy: { type: String, required: true },
  isCalibrated: { type: Boolean, default: false },
  tolerance: { type: Number, default: 0 },
  calibrationDetails: { type: String },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", ProductSchema);

const ErrorDetectorSchema = new Schema(
  {
    srfNo: { type: String, required: true },
    date: { type: Date, required: true },
    probableDate: { type: Date },
    organization: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    telephoneNumber: { type: String },
    emailId: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decisionRules: {
      noDecision: { type: Boolean, default: false },
      simpleConformative: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const ErrorDetector = mongoose.model("ErrorDetector", ErrorDetectorSchema);

module.exports = { ErrorDetector, Product };