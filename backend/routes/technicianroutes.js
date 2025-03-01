const express = require('express');
const router = express.Router();
const passport = require('passport');
const Technician = require('../models/technician');
const { ErrorDetector, Product } = require("../models/db");

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const technician = await Technician.findOne({
            $or: [{ username }, { email }]
        });

        if (!technician) {
            return res.status(401).json({ message: "Invalid technician credentials" });
        }

        const isMatch = await technician.authenticate(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid technician credentials" });
        }

        req.logIn(technician, (err) => {
            if (err) return res.status(500).json({ message: "Login error" });
            res.status(200).json({
                message: "Technician login successful",
                redirectUrl: "/technician"
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Error during technician logout" });
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Error clearing session" });
            res.clearCookie("session");
            res.status(200).json({ message: "Technician logged out successfully", redirectUrl: "/technician-login" });
        });
    });
});
router.get('/pending-equipments', async (req, res) => {
    try {
        const equipments = await Product.find({ isCalibrated: false });
        return res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/calibrated-equipments', async (req, res) => {
    try {
        const equipments = await Product.find({ isCalibrated: true });
        res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.put('/update-equipment/:id', async (req, res) => {
    const { id } = req.params;
    const details = req.body;

    if (!details.calibrationDetails) {
        return res.status(400).json({ success: false, message: "Calibration details are required" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { calibrationDetails: details.calibrationDetails, isCalibrated: true }, // Allow true/false values
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/check-auth', (req, res) => {
    if (req.isAuthenticated() && req.user instanceof Technician) {
      res.status(200).json({ 
        authenticated: true,
        userType: 'technician'
      });
    } else {
      res.status(401).json({ 
        authenticated: false,
        message: 'Not authenticated as technician'
      });
    }
  });

module.exports = router;



