const fs = require("fs");
const { generatePDF } = require("../services/generatePDFService");
const { appLogger } = require("../loggers/appLogger");
const { handleControllerError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/sendResponse");
const { validationResult } = require("express-validator");

const createPrescriptionPDF = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(
        res,
        400,
        {
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        },
        appLogger
      );
    }

    const orderData = req.body;

    // Generate PDF
    const pdfPath = await generatePDF(orderData);

    // Verify file exists
    if (!fs.existsSync(pdfPath)) {
      return sendResponse(
        res,
        500,
        {
          success: false,
          message: "PDF generation failed: File not created",
        },
        appLogger
      );
    }

    // Set response headers
    const filename = `prescription_${orderData.swilOrderId}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Stream file
    const fileStream = fs.createReadStream(pdfPath);

    // Handle streaming errors
    fileStream.on("error", (error) => {
      appLogger.error("PDF streaming error", { error, orderData });
      if (!res.headersSent) {
        sendResponse(
          res,
          500,
          {
            success: false,
            message: "Error streaming PDF file",
          },
          appLogger
        );
      }
    });

    // Clean up file after streaming
    fileStream.on("end", () => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          appLogger.error("Error deleting temporary PDF file", {
            error: err,
            path: pdfPath,
          });
        }
      });
    });

    fileStream.pipe(res);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = { createPrescriptionPDF };
