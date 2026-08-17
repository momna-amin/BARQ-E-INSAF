const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases, updateAdminProfile, getRecentActivity,
  getAllUsers, getAllCases, suspendUser
} = require('../controllers/adminController');

router.get('/stats',           protect, allowRoles('admin'), getStats);
router.get('/pending-lawyers', protect, allowRoles('admin'), getPendingLawyers);
router.put('/lawyers/:id/verify', protect, allowRoles('admin'), verifyLawyer);
router.get('/flagged-cases',   protect, allowRoles('admin'), getFlaggedCases);
router.put('/profile',         protect, allowRoles('admin'), updateAdminProfile);
router.get('/recent-activity', protect, allowRoles('admin'), getRecentActivity);
router.get('/users',           protect, allowRoles('admin'), getAllUsers);
router.get('/cases',           protect, allowRoles('admin'), getAllCases);
router.put('/users/:id/suspend', protect, allowRoles('admin'), suspendUser);

module.exports = router;