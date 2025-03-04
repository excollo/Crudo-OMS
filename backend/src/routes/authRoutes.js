const express = require('express');
const { logAuthActivity } = require("../loggers/authLogger");
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/signup", logAuthActivity ,authController.signup);
router.post("/signin", logAuthActivity ,authController.signin);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware.verifyToken, authController.logout);
router.post("/request-password-reset", logAuthActivity , authController.requestPasswordReset);

module.exports = router;