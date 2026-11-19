
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  loginAdmin,
  getMe,
  refreshCustomerToken,
  refreshAdminToken,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.post("/admin/login", loginAdmin);
router.get("/admin/me", protect, adminOnly, getMe);

router.post("/refresh", refreshCustomerToken);
router.post("/admin/refresh", refreshAdminToken);

module.exports = router;
