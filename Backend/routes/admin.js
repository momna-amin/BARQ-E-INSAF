const express = require('express');
const router = express.Router();
const {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity
} = require('../controllers/adminController');

router.get('/stats', getStats);
router.get('/pending-lawyers', getPendingLawyers);
router.put('/lawyers/:id/verify', verifyLawyer);
router.get('/flagged-cases', getFlaggedCases);
router.put('/profile', updateAdminProfile);
router.get('/recent-activity', getRecentActivity);

module.exports = router;