const express = require("express");
const router = express.Router();
const passport = require("passport");
const Technician = require("../models/technician");
const { srfForms, Product } = require("../models/db");
router.get("/pending", async (req, res) => {
  try {
    const forms = await srfForms.find({ formUpdated: true }).populate({
      path: "products",
      match: {
        $or: [
          { technicianCompleted: false }, // Not completed by technician yet
          { rejectedToDraft: true }, // Rejected by CSC, back to draft
        ],
      },
    });
    return res.status(200).json({ success: true, data: forms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const PartiallyCompletedForms = await srfForms
      .find({ requestStatus: false })
      .populate({
        path: "products",
        match: {
          technicianCompleted: true,
          cscApproved: true,
          isCalibrated: true,
        },
      });
    const completedForms = await srfForms
      .find({ requestStatus: true })
      .populate("products");

    const forms = [...PartiallyCompletedForms, ...completedForms];

    return res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:pid/:fid", async (req, res) => {
  const { pid, fid } = req.params;
  try {
    // Mark product as completed by technician, but not yet calibrated
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      {
        ...req.body,
        technicianCompleted: true,
        isCalibrated: false, // Keep false until CSC approves
        rejectedToDraft: false, // Reset rejection status
        cscReviewed: false,
        cscApproved: false, // Reset CSC approval status
        cscFeedback: "", // Clear previous feedback
        rejectedAt: null, // Clear rejection date
        calibratedDate: req.body.calibrationDate
          ? new Date(req.body.calibrationDate)
          : null,
      },
      { new: true }
    );

    // Don't automatically set form as completed - it will be handled by CSC
    const forms = await srfForms.find({ _id: fid }).populate("products");

    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/partiallyUpdate/:pid/:fid", async (req, res) => {
  const { pid, fid } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      {
        ...req.body,
        partialySaved: true,
        calibratedDate: req.body.calibrationDate
          ? new Date(req.body.calibrationDate)
          : null,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/updateform/:fid", async (req, res) => {
  const { fid } = req.params;
  try {
    const form = await srfForms
      .findByIdAndUpdate(
        fid,
        {
          conditionOfProduct: req.body.conditionOfProduct,
          itemEnclosed: req.body.itemEnclosed,
          specialRequest: req.body.specialRequest,
          decisionRules: req.body.decisionRules,
          calibrationPeriodicity: req.body.calibrationPeriodicity,
          reviewRequest: req.body.reviewRequest,
          calibrationFacilityAvailable: req.body.calibrationFacilityAvailable,
          calibrationServiceDoneByExternalAgency:
            req.body.calibrationServiceDoneByExternalAgency,
          calibrationMethodUsed: req.body.calibrationMethodUsed,
          formUpdated: true,
        },
        { new: true }
      )
      .populate("products");

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
