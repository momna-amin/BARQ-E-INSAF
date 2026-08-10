const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placeholder — wire up AWS S3 upload when ready
router.post('/upload', protect, (req, res) => {
  res.json({ message: 'Evidence upload endpoint — connect AWS S3 here' });
});

router.get('/case/:caseId', protect, (req, res) => {
  res.json({ message: `Get evidence for case ${req.params.caseId}` });
});

module.exports = router;