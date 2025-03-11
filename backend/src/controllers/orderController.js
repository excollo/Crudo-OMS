const orderService = require("../services/orderService");
const { sendResponse } = require("../utils/sendResponse");
const { handleControllerError } = require("../utils/errorHandler");
const { appLogger } = require("../loggers/appLogger");

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    sendResponse(res, 201, "Order created successfully", order);
  } catch (error) {
    handleControllerError(error, req, res, appLogger);
  }
};

module.exports = {
  createOrder,
};
