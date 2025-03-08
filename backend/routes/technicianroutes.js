const express = require("express");
const router = express.Router();
const passport = require("passport");
const Technician = require("../models/technician");
const { srfForms, Product } = require("../models/db");

// router.post("/login", async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const technician = await Technician.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (!technician) {
//       return res
//         .status(401)
//         .json({ message: "Invalid technician credentials" });
//     }

//     const isMatch = await technician.authenticate(password);
//     if (!isMatch) {
//       return res
//         .status(401)
//         .json({ message: "Invalid technician credentials" });
//     }

//     req.logIn(technician, (err) => {
//       if (err) return res.status(500).json({ message: "Login error" });
//       res.status(200).json({
//         message: "Technician login successful",
//         redirectUrl: "/technician",
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err)
//       return res
//         .status(500)
//         .json({ message: "Error during technician logout" });
//     req.session.destroy((err) => {
//       if (err)
//         return res.status(500).json({ message: "Error clearing session" });
//       res.clearCookie("session");
//       res.status(200).json({
//         message: "Technician logged out successfully",
//         redirectUrl: "/technician-login",
//       });
//     });
//   });
// });

// router.get("/check-auth", (req, res) => {
//   if (req.isAuthenticated() && req.user instanceof Technician) {
//     res.status(200).json({
//       authenticated: true,
//       userType: "technician",
//     });
//   } else {
//     res.status(401).json({
//       authenticated: false,
//       message: "Not authenticated as technician",
//     });
//   }
// });

router.get("/pending", async (req, res) => {
  try {
    const forms = await srfForms
      .find({ requestStatus: false })
      .populate("products");
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
        match: { isCalibrated: true }
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
    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      {
        ...req.body,
        isCalibrated: true,
        calibratedDate: req.body.calibrationDate ? new Date(req.body.calibrationDate) : null,
      },
      { new: true }
    );
    const form = await srfForms.findById(fid).populate("products");
    const allCalibrated = form.products.every(product => product.isCalibrated);

    if (allCalibrated) {
      await srfForms.findByIdAndUpdate(fid, { requestStatus: true });
    }
    const forms = await srfForms
      .find({ _id: fid })
      .populate("products");

    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/updateform/:fid", async (req, res) => {
  const { fid } = req.params;
  try {
    const form = await srfForms.findByIdAndUpdate(
      fid,
      {
        conditionOfProduct: req.body.conditionOfProduct,
        itemEnclosed: req.body.itemEnclosed,
        specialRequest: req.body.specialRequest,
        decisionRules: req.body.decisionRules,
        calibrationPeriodicity: req.body.calibrationPeriodicity,
        reviewRequest: req.body.reviewRequest,
        calibrationFacilityAvailable: req.body.calibrationFacilityAvailable,
        calibrationServiceDoneByExternalAgency: req.body.calibrationServiceDoneByExternalAgency,
        calibrationMethodUsed: req.body.calibrationMethodUsed,
        formUpdated: true,
      },
      { new: true }
    ).populate("products");

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;
