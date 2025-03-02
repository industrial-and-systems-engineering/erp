const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const ProductSchema = new Schema(
  {
    jobNo: { type: String, required: true },
    instrumentDescription: { type: String, required: true },
    serialNo: { type: String, required: true },
    parameter: { type: String, required: true },
    ranges: { type: String, required: true },
    accuracy: { type: String, required: true },
    calibrationStatus: { type: String, required: false },
    calibratedDate: { type: Date, required: false },
    remarks: { type: String, required: false },
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
    probableDate: { type: Date },
    //1.
    organization: { type: String, required: true },
    address: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    telephoneNumber: { type: String },
    emailId: { type: String, required: true },
    //2.
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    //3.
    conditionOfProduct: { type: String, required: false },
    //4.
    itemEnclosed: { type: String, required: false },
    //5
    specialRequest: { type: String, required: false },
    //6
    decisionRules: {
      noDecision: { type: Boolean, default: false },
      simpleConformative: { type: Boolean, default: false },
      conditionalConformative: { type: Boolean, default: false },
      customerDrivenConformative: { type: Boolean, default: false },
    },
    //7
    calibrationPeriodicity: { type: String, required: false },
    //8
    reviewRequest: { type: String, default: false },
    //9
    calibrationFacilityAvailable: { type: String, required: false },
    //10
    calibrationServiceDoneByExternalAgency: { type: String, required: false },
    //11
    calibrationMethodUsed: { type: String, required: false },
    //requestStatus
    requestStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const srfForms = mongoose.model("srfForms", ServiceRequestFormSchema);

module.exports = { srfForms, Product };
