
const express = require('express');
const router = express.Router();

const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  sendEnquiryReply,
} = require('../controllers/enquiryController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public customer submission
router.post('/', createEnquiry);

// Admin-only actions
router.get('/', protect, adminOnly, getEnquiries);
router.put('/:id/status', protect, adminOnly, updateEnquiryStatus);
router.post('/:id/reply', protect, adminOnly, sendEnquiryReply);
module.exports = router;
