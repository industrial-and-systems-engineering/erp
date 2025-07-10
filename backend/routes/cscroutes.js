const express = require("express");
const router = express.Router();
const passport = require("passport");
const Technician = require("../models/technician");
const { srfForms, Product } = require("../models/db");
router.get("/pending", async (req, res) => {
  try {
    const forms = await srfForms
      .find({
        $or: [
          { formUpdated: false }, // Original CSC pending items
          { formUpdated: true }, // Items completed by technician waiting for review
        ],
      })
      .populate({
        path: "products",
      });
    return res.status(200).json({ success: true, data: forms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const completedForms = await srfForms
      .find({ formUpdated: true })
      .populate("products");

    const forms = [...completedForms];

    return res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update/:fid", async (req, res) => {
  const { fid } = req.params;
  try {
    const updatedForm = await srfForms.findByIdAndUpdate(
      fid,
      {
        ...req.body,
        formUpdated: true,
      },
      { new: true }
    );
    // const form = await srfForms.findById(fid).populate("products");
    // const allCalibrated = form.products.every(product => product.isCalibrated);

    // if (allCalibrated) {
    //     await srfForms.findByIdAndUpdate(fid, { requestStatus: true });
    // }
    const forms = await srfForms.find({ _id: fid }).populate("products");

    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// router.put("/updateform/:fid", async(req, res) => {
//     const { fid } = req.params;
//     try {
//         const form = await srfForms.findByIdAndUpdate(
//             fid, {
//                 conditionOfProduct: req.body.conditionOfProduct,
//                 itemEnclosed: req.body.itemEnclosed,
//                 specialRequest: req.body.specialRequest,
//                 decisionRules: req.body.decisionRules,
//                 calibrationPeriodicity: req.body.calibrationPeriodicity,
//                 reviewRequest: req.body.reviewRequest,
//                 calibrationFacilityAvailable: req.body.calibrationFacilityAvailable,
//                 calibrationServiceDoneByExternalAgency: req.body.calibrationServiceDoneByExternalAgency,
//                 calibrationMethodUsed: req.body.calibrationMethodUsed,
//                 formUpdated: true,
//             }, { new: true }
//         ).populate("products");

//         res.status(200).json({ success: true, data: form });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// New routes for CSC review process
router.put("/approve/:pid/:fid", async (req, res) => {
  const { pid, fid } = req.params;
  try {
    // Approve the product and mark as calibrated
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      {
        cscReviewed: true,
        cscApproved: true,
        isCalibrated: true,
        rejectedToDraft: false,
      },
      { new: true }
    );

    // Check if all products in the form are approved
    const form = await srfForms.findById(fid).populate("products");
    const allApproved = form.products.every(
      (product) => product.cscApproved && product.isCalibrated
    );

    if (allApproved) {
      await srfForms.findByIdAndUpdate(fid, { requestStatus: true });
    }

    const forms = await srfForms.find({ _id: fid }).populate("products");

    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/reject/:pid/:fid", async (req, res) => {
  const { pid, fid } = req.params;
  const { feedback } = req.body; // Get feedback from request body

  try {
    // Reject the product and send back to technician as draft
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      {
        cscReviewed: true,
        cscApproved: false,
        isCalibrated: false,
        technicianCompleted: false,
        rejectedToDraft: true,
        cscFeedback: feedback || "", // Store the feedback
        rejectedAt: new Date(),
        rejectedBy: req.user ? req.user.username : "CSC", // Store who rejected it
      },
      { new: true }
    );

    const forms = await srfForms.find({ _id: fid }).populate("products");

    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
