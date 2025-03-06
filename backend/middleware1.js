const express = require('express');
const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();}
   req.flash('error', 'You must be signed in first');
  return res.status(401).json({ success: false, message: 'Not authenticated', redirectUrl: '/user',  error: req.flash('error')});
};

module.exports = { isLoggedIn };