const express = require("express");
const {
  generatePDFController
} = require("../controllers/generatePDFController");
const { logActivity } = require("../loggers/appLogger");
const { authMiddleware } = require("../middleware/authMiddleware");
const { pdfGenerationSanitization } = require("../sanitize/sanitize");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware.authenticate,
  logActivity,
  pdfGenerationSanitization,
  generatePDFController.createPrescriptionPDF
);

module.exports = router;
