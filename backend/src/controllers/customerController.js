const { appLogger } = require("../loggers/appLogger");
const customerService = require("../services/customerService");
const { handleControllerError } = require("../utils/errorHandler");
const { sendResponse } = require("../utils/sendResponse");

const getCustomerList = async (req, res) => {
  const { pageNo = 1, pageSize = -1, search = "" } = req.query;
  try {
    const customers = await customerService.fetchCustomerList(
      pageNo,
      pageSize,
      search
    );
    sendResponse(res, 200, "Customer list fetched successfully", customers);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await customerService.fetchCustomerById(id);
    sendResponse(res, 200, "Customer fetched successfully", customer);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    const result = await customerService.createCustomer(customerData);
    sendResponse(res, 201, "Customer created successfully", result);
  } catch (error) {
    if (error.message.includes("Error:")) {
      sendResponse(res, 400, error.message, null);
      return;
    }
    handleControllerError(error, req, res, appLogger);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerData = {
      fullname: req.body.Customer,
      email: req.body.Email || req.body.email,
      phoneNumber: req.body.Mobile || req.body.phoneNumber,
      alias: req.body.Alias || req.body.alias,
      pincode: req.body.Pincode || req.body.pincode,
      station: req.body.Station || req.body.station,
      address: req.body.Address || req.body.address,
      Druglicence: req.body.Druglicence,
      Gstno: req.body.Gstno,
      PanNo: req.body.PanNo,
    };

    // Validate that we have at least one field to update
    if (Object.keys(customerData).length === 0) {
      return sendResponse(res, 400, "No update data provided", null);
    }

    const result = await customerService.updateCustomer(
      customerId,
      customerData
    );
    sendResponse(res, 200, "Customer updated successfully", result);
  } catch (error) {
    if (error.message.includes("Error:")) {
      sendResponse(res, 400, error.message, null);
      return;
    }
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = {
  getCustomerList,
  getCustomerById,
  createCustomer,
  updateCustomer
};