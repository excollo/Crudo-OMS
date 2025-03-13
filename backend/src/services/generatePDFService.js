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
    leftColumnX: 50,
    rightColumnX: 300,
  },
  customerDetailsStartY: 180,
  lineSpacing: 25,
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
  if (!orderData || !orderData.swilOrderId || !orderData.customer || !orderData.products) {
    throw new Error("Invalid order data for PDF generation");
  }

  const pdfDir = path.join(__dirname, "../generated_pdfs");
  await ensureDirectoryExists(pdfDir);
  const pdfPath = path.join(pdfDir, `order_${orderData.swilOrderId}.pdf`);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: PDF_CONFIG.margin });
      const stream = fs.createWriteStream(pdfPath);

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);

      doc.pipe(stream);

      addStoreInformation(doc, orderData.store);
      addTitle(doc);
      addCustomerDetails(doc, orderData);
      addMedicineTable(doc, orderData.products);
      addTotalPrice(doc, orderData.products);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const addStoreInformation = (doc, storeData = {}) => {
  doc.font(PDF_CONFIG.fonts.bold).fontSize(PDF_CONFIG.fontSize.subtitle).text("Medical Store Name", { align: "left" });
  doc.font(PDF_CONFIG.fonts.normal).fontSize(PDF_CONFIG.fontSize.normal)
    .text(`Address: ${storeData?.address || "N/A"}`, { align: "left" })
    .text(`Mobile: ${storeData?.mobile || "N/A"}`, { align: "left" })
    .moveDown(1);
};

const addTitle = (doc) => {
  doc.font(PDF_CONFIG.fonts.bold).fontSize(PDF_CONFIG.fontSize.title).text("Order Prescription", { align: "center" }).moveDown(1);
};

const addCustomerDetails = (doc, orderData) => {
  let y = PDF_CONFIG.customerDetailsStartY;
  const leftColumnX = PDF_CONFIG.columns.leftColumnX;
  const rightColumnX = leftColumnX + 350; // Increased spacing for better alignment

  const customer = orderData.customer || {};

  const details = [
    ["Order ID:", orderData.swilOrderId, "Customer ID:", customer.customerId || "N/A"],
    ["Customer Name:", customer.name || "N/A", "Age:", `${customer.age || "N/A"} years`],
    ["Sex:", customer.sex || "N/A", "Mobile No:", customer.mobile || "N/A"],
    ["ABHA No:", customer.abhaNo || "N/A", "Address:", customer.address || "N/A"],
  ];

  doc.font(PDF_CONFIG.fonts.normal).fontSize(PDF_CONFIG.fontSize.normal);

  details.forEach(([label1, value1, label2, value2]) => {
    doc.text(label1, leftColumnX, y, { continued: true }).text(` ${value1}`);
    doc.text(label2, rightColumnX, y, { continued: true }).text(` ${value2}`);
    y += PDF_CONFIG.lineSpacing + 1; // Increased vertical spacing
  });

  doc.moveDown(2);
};



const addMedicineTable = (doc, products = []) => {
  const { medicineColWidths } = PDF_CONFIG;
  const medicineHeaders = ["Medicine Name", "Dosage", "Frequency", "Time", "Duration", "Price"];
  let x = PDF_CONFIG.columns.leftColumnX;
  const tableY = doc.y;

  doc.font(PDF_CONFIG.fonts.bold);
  medicineHeaders.forEach((header, i) => {
    doc.text(header, x, tableY, { width: medicineColWidths[i], align: "left" });
    x += medicineColWidths[i];
  });
  doc.moveDown(0.5);

  doc.font(PDF_CONFIG.fonts.normal);
  products.forEach((medicine) => {
    let rowX = PDF_CONFIG.columns.leftColumnX;
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
      doc.text(value, rowX, rowY, { width: medicineColWidths[i], align: "left" });
      rowX += medicineColWidths[i];
    });

    doc.moveDown(0.5);
  });
};

const addTotalPrice = (doc, products = []) => {
  const totalMedicineAmount = products.reduce((sum, med) => sum + (parseFloat(med.price) || 0), 0);
  doc.moveDown(2).font(PDF_CONFIG.fonts.bold).text(`Total Price: Rs${totalMedicineAmount.toFixed(2)}`, PDF_CONFIG.columns.leftColumnX);
};

module.exports = { generatePDF };
