const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/isloggedin', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ isLoggedIn: true, username: req.user.username });
    } else {
        req.flash('error', 'You must be signed in first');
        return res.status(401).json({ message: 'Not authenticated', redirectUrl: '/user', error: req.flash('error') });
    }
});

module.exports=router;