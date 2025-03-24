const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter");
const FORM_COUNTER_ID = "global_form_counter";
const ProductSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    form: { type: mongoose.Schema.Types.ObjectId, ref: "srfForms", required: true },
    productNumber: { type: Number },
    jobNo: { type: String },
    instrumentDescription: { type: String, required: true },
    serialNo: { type: String, required: true },
    parameter: { type: String, required: true },
    ranges: { type: String, required: true },
    accuracy: { type: String, required: true },
    methodUsed: { type: String, required: true },
    calibrationStatus: { type: String },
    calibratedDate: { type: Date },
    remarks: { type: String },
    isCalibrated: { type: Boolean, default: false },
    readings: {
      type: [{
        rName: { type: String, default: "0" },
        rUnit: { type: String, default: "0" },
        ducDetails: { type: String, default: "0" },
        dateOfMeasument: { type: Date, default: Date.now() },
        masterAccuracy: { type: String, default: "0" },
        masterCertUncertainty: { type: String, default: "0" },
        ducResolution: { type: String, default: "0" },
        masterResolution: { type: String, default: "0" },
        observations: { type: [String], default: [] },
        ducValueSet: { type: String },
        //type-a
        mean: { type: String, default: "0" },
        standardDeviation: { type: String, default: "0" },
        uncertainty: { type: String, default: "0" },
        stdUncertainty: { type: String, default: "0" },
        stdUncertaintyPercentage: { type: String, default: "0" },
        //type-b
        u1: { type: String },
        u2: { type: String },
        u3: { type: String },
        //u5
        stability: { type: String },
        u5: { type: String },
        uc: { type: String },
        eDof: { type: String },
        kAt95CL: { type: String },
        ue: { type: String },
        uePercentage: { type: String },
        uePercentageFilled: { type: String },
        result: { type: String },
      }],
    }
  },
  { timestamps: true }
);
ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const form = await mongoose.model("srfForms").findById(this.form);

      if (!form) {
        console.log("Form not found");
        return next(new Error("Form not found"));
      }
      const productCounterId = `productNumber_form_${form._id}`;
      const productCounter = await Counter.findOneAndUpdate(
        { _id: productCounterId },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      this.productNumber = productCounter.sequence_value;
      this.jobNo = `${form.formNumber}-P${this.productNumber}`;
      console.log("Generated jobNo:", this.jobNo);

      next();
    } catch (err) {
      console.error("Error in pre-save hook:", err);
      next(err);
    }
  } else {
    console.log("Product is not new, skipping jobNo generation");
    next();
  }
});
ProductSchema.index({ form: 1, productNumber: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);
const ServiceRequestFormSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    srfNo: { type: String, required: true },
    formNumber: { type: Number },
    date: { type: Date, required: true },
    probableDate: { type: Date },
    organization: { type: String, required: true },
    address: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    telephoneNumber: { type: String },
    emailId: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
    formUpdated: { type: Boolean, default: false },
    eSignature: { type: String, required: true },
    signerName: { type: String, required: true },
    signedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ServiceRequestFormSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const formCounter = await Counter.findOneAndUpdate(
        { _id: FORM_COUNTER_ID },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      this.formNumber = formCounter.sequence_value;
      this.srfNo = `kgp/24-25/${this.formNumber}`;
      next();
    } catch (err) {
      console.error("Error in pre-save hook:", err);
      next(err);
    }
  } else {
    next();
  }
});
ServiceRequestFormSchema.index({ formNumber: 1 }, { unique: true });
ServiceRequestFormSchema.index({ srfNo: 1 }, { unique: true });

const srfForms = mongoose.model("srfForms", ServiceRequestFormSchema);

module.exports = { srfForms, Product };