const express = require('express');
const router = express.Router();
const {
  createCase, getMyCases, getCaseById,
  updateCaseStatus, assignLawyer,
} = require('../controllers/caseController');
const { protect, allowRoles } = require('../middleware/auth');

router.post('/',              protect, allowRoles('citizen'), createCase);
router.get('/my',             protect, getMyCases);
router.get('/:id',            protect, getCaseById);
router.put('/:id/status',     protect, updateCaseStatus);
router.put('/:id/assign',     protect, allowRoles('lawyer', 'admin'), assignLawyer);

module.exports = router;