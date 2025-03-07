const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: "Internal server error" });
        if (!user) return res.status(401).json({ message: "Invalid username or password" });
        
        req.logIn(user, (err) => { 
            if (err) return res.status(500).json({ message: "Internal server error" });
            res.status(200).json({ message: "User login successful", redirectUrl: "/user",usernumber:user.userNumber});
        });
    })(req, res, next);
});

router.post('/register', async (req, res) => {
    const { username, email, password ,usertype} = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        
        const newUser = new User({ username, email,usertype });
        await User.register(newUser, password); 

    
        req.logIn(newUser, (err) => {
            if (err) return res.status(500).json({ message: 'Login error after registration' });
            res.status(201).json({
                message: 'User registered successfully',
                redirectUrl: '/user' 
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Error during logout" });
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error clearing session" });
            }
            res.clearCookie('session'); 
            res.status(200).json({ message: "Logged out successfully", redirectUrl: "/user" });
        });
    });
});

module.exports = router;
