const express = require('express');
const router = express.Router();
const { getLawyers, getLawyerById, rateLawyer } = require('../controllers/lawyerController');
const { protect } = require('../middleware/auth');

router.get('/',         protect, getLawyers);
router.get('/:id',      protect, getLawyerById);
router.post('/:id/rate',protect, rateLawyer);

module.exports = router;