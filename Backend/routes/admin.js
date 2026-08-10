const express = require('express');
const router = express.Router();
const {
  getStats, getPendingLawyers, verifyLawyer, getFlaggedCases,
} = require('../controllers/adminController');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/stats',              protect, allowRoles('admin'), getStats);
router.get('/pending-lawyers',    protect, allowRoles('admin'), getPendingLawyers);
router.put('/lawyers/:id/verify', protect, allowRoles('admin'), verifyLawyer);
router.get('/flagged-cases',      protect, allowRoles('admin'), getFlaggedCases);

module.exports = router;