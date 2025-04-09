const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/isloggedin/user', (req, res) => {
    if (req.isAuthenticated()&& req.user.usertype === 'customer') {
        return res.status(200).json({ isLoggedIn: true, username: req.user.username });
    } else {
        req.flash('error', 'You must be signed in first');
        return res.status(401).json({ message: 'Not authenticated', redirectUrl: '/user', error: req.flash('error') });
    }
});

router.get('/isloggedin/technician', (req, res) => {
    if (req.isAuthenticated()&& req.user.usertype === 'Technician') {
        return res.status(200).json({ isLoggedIn: true, username: req.user.username });
    } else {
        req.flash('error', 'You must be signed in first');
        return res.status(401).json({ message: 'Not authenticated', redirectUrl: '/user', error: req.flash('error') });
    }
});

router.get('/isloggedin/csc', (req, res) => {
    if (req.isAuthenticated()&& req.user.usertype === 'customerservicecell') {
        return res.status(200).json({ isLoggedIn: true, username: req.user.username });
    } else {
        req.flash('error', 'You must be signed in first');
        return res.status(401).json({ message: 'Not authenticated', redirectUrl: '/user', error: req.flash('error') });
    }
});


module.exports=router;