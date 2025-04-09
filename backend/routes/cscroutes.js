const express = require("express");
const router = express.Router();
const passport = require("passport");
const Technician = require("../models/technician");
const { srfForms, Product } = require("../models/db");
router.get("/pending", async(req, res) => {
    try {
        const forms = await srfForms
            .find({ formUpdated: false })
            .populate({
                path: "products",
            });
        return res.status(200).json({ success: true, data: forms });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/completed", async(req, res) => {
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

router.put("/update/:fid", async(req, res) => {
    const { fid } = req.params;
    try {
        const updatedForm = await srfForms.findByIdAndUpdate(
            fid, {
                ...req.body,
                formUpdated: true,
            }, { new: true }
        );
        // const form = await srfForms.findById(fid).populate("products");
        // const allCalibrated = form.products.every(product => product.isCalibrated);

        // if (allCalibrated) {
        //     await srfForms.findByIdAndUpdate(fid, { requestStatus: true });
        // }
        const forms = await srfForms
            .find({ _id: fid })
            .populate("products");

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



module.exports = router;