const fs = require("fs");
const {generatePDF} = require("../services/generatePDFService");
const { appLogger } = require("../loggers/appLogger");
const { handleControllerError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/sendResponse");

const createPrescriptionPDF = async (req, res, next) => {
  const orderData = req.body;

  try {
    // Generate the PDF file
    const pdfPath = await generatePDF(orderData);

    // Verify the file exists
    if (!fs.existsSync(pdfPath)) {
      sendResponse(
        res,
        500,
        "PDF generation failed: File not created",
        appLogger
      );
    }

    // Set appropriate PDF download headers
    const filename = `prescription_${orderData.swilOrderId || "order"}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Stream the file to the response
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Handle streaming errors
    fileStream.on("error", (err) => {
      if (!res.headersSent) {
         sendResponse(res, 500, "Error streaming PDF file", appLogger);
      }
    });
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = { createPrescriptionPDF };
