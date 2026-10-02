const express = require("express");
const auth = require("../middleware/auth");
const {
  register,
  login,
  me,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", auth, me);

module.exports = router;
