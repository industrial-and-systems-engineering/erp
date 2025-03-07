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

router.get('/getcount', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ usernumber: req.user.userNumber });
  });


module.exports=router;