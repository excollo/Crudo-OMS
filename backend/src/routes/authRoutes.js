const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware.verifyToken, authController.logout);

module.exports = router;