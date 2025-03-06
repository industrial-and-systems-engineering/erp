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
    calibrationStatus: { type: String },
    calibratedDate: { type: Date },
    remarks: { type: String },
    isCalibrated: { type: Boolean, default: false },
  },
  { timestamps: true }
);
ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      let userId;
      if (typeof this.user === "string") {
        userId = mongoose.Types.ObjectId(this.user);
      } else {
        userId = this.user;
      }
      const user = await mongoose.model("User").findById(userId);

      if (!user || !user.userNumber) {
        console.log("User or userNumber missing", user);
        return next(new Error("UserNumber is missing for the user."));
      }
      const counterId = `productNumber_${userId}`;

      const counter = await Counter.findOneAndUpdate(
        { _id: counterId },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      this.productNumber = counter.sequence_value;
      this.jobNo = `${user.userNumber}-${this.productNumber}`;
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
ProductSchema.index({ user: 1, productNumber: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);
const ServiceRequestFormSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    srfNo: { type: String, required: true },
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
    formUpdated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const srfForms = mongoose.model("srfForms", ServiceRequestFormSchema);

module.exports = { srfForms, Product };