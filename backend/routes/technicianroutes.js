const express = require("express");
const router = express.Router();
const passport = require("passport");
const Technician = require("../models/technician");
const { srfForms, Product } = require("../models/db");
router.get("/pending", async (req, res) => {
    try {
        const forms = await srfForms
            .find({ formUpdated: true })
            .populate({
                path: "products",
                match: { isCalibrated: false }
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
            pid, {
            ...req.body,
            isCalibrated: true,
            calibratedDate: req.body.calibrationDate ? new Date(req.body.calibrationDate) : null,
        }, { new: true }
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

router.put("/partiallyUpdate/:pid/:fid", async (req, res) => {
    const { pid, fid } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            pid, {
            ...req.body,
            partialySaved: true,
            calibratedDate: req.body.calibrationDate ? new Date(req.body.calibrationDate) : null,
        }, { new: true }
        );
        return res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.put("/updateform/:fid", async (req, res) => {
    const { fid } = req.params;
    try {
        const form = await srfForms.findByIdAndUpdate(
            fid, {
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
        }, { new: true }
        ).populate("products");

        res.status(200).json({ success: true, data: form });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;