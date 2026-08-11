'use strict';
const express = require('express');
const router = express.Router();
const {
  register, sendRegisterOtp, verifyRegisterOtpAndCreate, login, getMe,
  refreshToken, forgotPassword, verifyOtp, resetPassword, googleAuth,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Existing
router.post('/register',             register);
router.post('/send-register-otp',    sendRegisterOtp);
router.post('/verify-register-otp',  verifyRegisterOtpAndCreate);
router.post('/login',                login);
router.get('/me',                    protect, getMe);

// Persistent Session — Refresh Token
router.post('/refresh',         refreshToken);

// Forgot Password — 3-step OTP flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp',      verifyOtp);
router.post('/reset-password',  resetPassword);

// Google OAuth (all 3 portals use this — role passed in body)
router.post('/google',          googleAuth);

module.exports = router;