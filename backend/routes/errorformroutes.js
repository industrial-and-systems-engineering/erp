const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ErrorDetector, Product } = require("../models/db");
//const { isLoggedIn } = require('../middleware'); 

function preprocessing(products) {
    for (let i = 0; i < products.length; i++) {
        products[i].tolerance = parseFloat(products[i].parameter) * 0.05;
    }
    return products;
}

router.post("/", async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    if (!req.body || !req.body.products) {
      return res.status(400).json({ error: "No form data provided" });
    }

    const productDocs = await Product.insertMany(preprocessing(req.body.products));

    const userId = req.user.id;
    const newForm = new ErrorDetector({
      srfNo: req.body.srfNo,
      date: req.body.date,
      probableDate: req.body.probableDate,
      organization: req.body.organization,
      address: req.body.address,
      contactPerson: req.body.contactPerson,
      mobileNumber: req.body.mobileNumber,
      telephoneNumber: req.body.telephoneNumber,
      emailId: req.body.emailId,
      products: productDocs.map((p) => p._id),
      user: userId,
      decisionRules: req.body.decisionRules || {}
    });

    await newForm.save(); // Ensure this runs every time
    console.log("ErrorDetector form successfully saved!");

    return res.status(201).json({
      message: "Form submitted successfully",
      redirectURL: "/user",
    });

  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Error saving form data" });
  }
});


router.get("/calibrated", async (req, res) => {
  try {
    const userId = req.user.id;
    const errorForms = await ErrorDetector.find({ user: userId }).populate("products");


    const calibratedForms = errorForms.map(form => ({
      ...form.toObject(),
      products: form.products.filter(product => product.isCalibrated)
    })).filter(form => form.products.length > 0);

    res.status(200).json(calibratedForms);
  } catch (error) {
    console.error("Error fetching calibrated error forms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/calibrated/pending", async (req, res) => {
  try {

    const userId = req.user.id;
    const errorForms = await ErrorDetector.find({ user: userId }).populate("products");


    const pendingForms = errorForms.map(form => ({
      ...form.toObject(),
      products: form.products.filter(product => (!product.isCalibrated))
    })).filter(form => form.products.length > 0);

    res.status(200).json(pendingForms);
  } catch (error) {
    console.error("Error fetching calibrated error forms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/technician/updateEquipment/:id", async (req, res) => {
  const { id } = req.params;
  const { isCalibrated } = req.body;

  if (typeof isCalibrated === "undefined") {
    return res.status(400).json({ success: false, message: "isCalibrated field is required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isCalibrated }, // Allow true/false values
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;




