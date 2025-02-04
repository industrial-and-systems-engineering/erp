const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admin = require('../models/admin');

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const admin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (!admin) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        const isMatch = await admin.authenticate(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        req.logIn(admin, (err) => {
            if (err) return res.status(500).json({ message: "Login error" });
            res.status(200).json({
                message: "Admin login successful",
                redirectUrl: "/admin"
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Error during admin logout" });
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Error clearing session" });
            res.clearCookie("session");
            res.status(200).json({ message: "Admin logged out successfully", redirectUrl: "/admin-login" });
        });
    });
});

module.exports=router;



