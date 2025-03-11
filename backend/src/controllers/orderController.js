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

const getAllOrders = async (req,res) => {
  try{
    const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1} = req.query;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      orderStatus: req.query.status,
      customerId: req.query.customerId
    }

    const orders = await orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      sortBy,
      parseInt(sortOrder),
      filters
    );

    sendResponse(res, 200, "Orders fetched successfully", orders);
  } catch(error){
    handleControllerError(error, req, res, appLogger);
  }
}

const getOrderById = async (req, res) => {
  try{
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    sendResponse(res, 200, "Order fetched successfully", order);
  } catch(error){
    handleControllerError(error, req, res, appLogger);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById
};
