
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("X-MotoGT-Appointment-Router", "loaded");
  next();
});

const {
  createAppointment,
  getMyAppointments,
  getAvailableDates,
  getAllAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  updateWorkshopSettings,
  getWorkshopSettingsForAdmin
} = require('../controllers/appointmentController');

const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
// Customer Routes
router.post('/', optionalProtect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/available-dates', getAvailableDates);

// Admin Routes
router.get('/admin/all', protect, adminOnly, getAllAppointments);
router.get('/admin/settings', protect, adminOnly, getWorkshopSettingsForAdmin);
router.put('/admin/settings', protect, adminOnly, updateWorkshopSettings);

router.put('/admin/:id/approve', protect, adminOnly, approveAppointment);
router.put('/admin/:id/reject', protect, adminOnly, rejectAppointment);
router.put('/admin/:id/complete', protect, adminOnly, completeAppointment);

module.exports = router;
