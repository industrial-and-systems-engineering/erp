const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter");
const User = require("./user");
const ProductSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productNumber: { type: Number },
    jobNo: { type: String },
    instrumentDescription: { type: String, required: true },
    serialNo: { type: String, required: true },
    parameter: { type: String, required: true },
    ranges: { type: String, required: true },
    accuracy: { type: String, required: true },
    calibrationStatus: { type: String, default: undefined, required: false },
    calibratedDate: { type: Date, required: false },
    remarks: { type: String, required: false },
    isCalibrated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
const ServiceRequestFormSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    srfNo: { type: String, required: true },
    date: { type: Date, required: true },
    probableDate: { type: Date, required: false },
    //1.
    organization: { type: String, required: true },
    address: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    telephoneNumber: { type: String },
    emailId: { type: String, required: true },
    // Products array
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // Additional details
    conditionOfProduct: { type: String },
    itemEnclosed: { type: String },
    specialRequest: { type: String },
    decisionRules: {
      noDecision: { type: Boolean, default: false },
      simpleConformative: { type: Boolean, default: false },
      conditionalConformative: { type: Boolean, default: false },
      customerDrivenConformative: { type: Boolean, default: false },
    },
    calibrationPeriodicity: { type: String },
    reviewRequest: { type: String, default: false },
    calibrationFacilityAvailable: { type: String },
    calibrationServiceDoneByExternalAgency: { type: String },
    calibrationMethodUsed: { type: String },
    requestStatus: { type: Boolean, default: false },
    URL_NO: { type: String },
  },
  { timestamps: true }
);

const srfForms = mongoose.model("srfForms", ServiceRequestFormSchema);

module.exports = { srfForms, Product };
