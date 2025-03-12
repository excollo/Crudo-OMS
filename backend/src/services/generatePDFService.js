const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const PDF_CONFIG = {
  margin: 50,
  fonts: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
  },
  fontSize: {
    title: 18,
    subtitle: 16,
    normal: 12,
  },
  columns: {
    left: 50,
    right: 400,
  },
  customerDetailsStartY: 180,
  lineSpacing: 20,
  medicineColWidths: [150, 80, 80, 80, 80, 80],
};

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

const generatePDF = async (orderData) => {
  // Validate order data
  if (
    !orderData ||
    !orderData.swilOrderId ||
    !orderData.customer ||
    !orderData.products
  ) {
    throw new Error("Invalid order data for PDF generation");
  }

  // Setup PDF directory and path
  const pdfDir = path.join(__dirname, "../generated_pdfs");
  await ensureDirectoryExists(pdfDir);
  const pdfPath = path.join(pdfDir, `order_${orderData.swilOrderId}.pdf`);

  return new Promise((resolve, reject) => {
    try {
      // Initialize PDF document
      const doc = new PDFDocument({ margin: PDF_CONFIG.margin });
      const stream = fs.createWriteStream(pdfPath);

      // Setup event handlers
      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);

      // Pipe document to file stream
      doc.pipe(stream);

      // Generate PDF content
      addStoreInformation(doc, orderData.store);
      addTitle(doc);
      addCustomerDetails(doc, orderData);
      addMedicineTable(doc, orderData.products);
      addTotalPrice(doc, orderData.products);

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const addStoreInformation = (doc, storeData = {}) => {
  doc
    .font(PDF_CONFIG.fonts.bold)
    .fontSize(PDF_CONFIG.fontSize.subtitle)
    .text("Medical Store Name", { align: "left" });

  doc
    .font(PDF_CONFIG.fonts.normal)
    .fontSize(PDF_CONFIG.fontSize.normal)
    .text(`Address: ${storeData?.address || "N/A"}`, { align: "left" })
    .text(`Mobile: ${storeData?.mobile || "N/A"}`, { align: "left" })
    .moveDown(1);
};

const addTitle = (doc) => {
  doc
    .font(PDF_CONFIG.fonts.bold)
    .fontSize(PDF_CONFIG.fontSize.title)
    .text("Order Prescription", { align: "center" })
    .moveDown(1);
};

const addCustomerDetails = (doc, orderData) => {
  const { leftColumnX, rightColumnX } = PDF_CONFIG.columns;
  let y = PDF_CONFIG.customerDetailsStartY;
  const customer = orderData.customer || {};

  doc.font(PDF_CONFIG.fonts.normal).fontSize(PDF_CONFIG.fontSize.normal);

  // Order & Customer ID
  doc.text(`Order ID: ${orderData.swilOrderId}`, leftColumnX, y);
  doc.text(`Customer ID: ${customer.customerId}`, rightColumnX, y);
  y += PDF_CONFIG.lineSpacing;

  // Customer Name & Age
  doc.text(`Customer Name: ${customer.name}`, leftColumnX, y);
  doc.text(
    `Age: ${customer.age || "N/A"} ${customer.age ? "years" : ""}`,
    rightColumnX,
    y
  );
  y += PDF_CONFIG.lineSpacing;

  // Sex & Mobile
  doc.text(`Sex: ${customer.sex || "N/A"}`, leftColumnX, y);
  doc.text(`Mobile No: ${customer.mobile || "N/A"}`, rightColumnX, y);
  y += PDF_CONFIG.lineSpacing;

  // ABHA & Address
  doc.text(`ABHA No: ${customer.abhaNo || "N/A"}`, leftColumnX, y);
  doc.text(`Address: ${customer.address || "N/A"}`, rightColumnX, y);

  doc.moveDown(2);
};

const addMedicineTable = (doc, products = []) => {
  const { medicineColWidths } = PDF_CONFIG;
  const medicineHeaders = [
    "Medicine Name",
    "Dosage",
    "Frequency",
    "Time",
    "Duration",
    "Price",
  ];

  // Table Headers
  let x = PDF_CONFIG.columns.left;
  const tableY = doc.y;

  doc.font(PDF_CONFIG.fonts.bold);

  medicineHeaders.forEach((header, i) => {
    doc.text(header, x, tableY, {
      width: medicineColWidths[i],
      align: "center",
    });
    x += medicineColWidths[i];
  });

  doc.moveDown(0.5);

  // Table Rows
  doc.font(PDF_CONFIG.fonts.normal);

  products.forEach((medicine) => {
    let rowX = PDF_CONFIG.columns.left;
    const rowY = doc.y;
    const columns = [
      medicine.name || "N/A",
      medicine.dosage || "N/A",
      medicine.frequency || "N/A",
      medicine.time || "N/A",
      medicine.duration || "N/A",
      `Rs${medicine.price || 0}`,
    ];

    columns.forEach((value, i) => {
      doc.text(value, rowX, rowY, {
        width: medicineColWidths[i],
        align: "center",
      });
      rowX += medicineColWidths[i];
    });

    doc.moveDown(0.5);
  });
};

const addTotalPrice = (doc, products = []) => {
  const totalMedicineAmount = products.reduce(
    (sum, med) => sum + (parseFloat(med.price) || 0),
    0
  );

  doc
    .moveDown(2)
    .font(PDF_CONFIG.fonts.bold)
    .text(
      `Total Price: Rs${totalMedicineAmount.toFixed(2)}`,
      PDF_CONFIG.columns.left
    );
};

module.exports = { generatePDF };
