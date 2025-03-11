const axios = require("axios");
const { Order } = require("../models/Order");
const {
  UnauthorizedError,
  InternalServerError,
  ValidationError,
} = require("../utils/customErrors");

const SWIL_API_BASE_URL = process.env.SWILERP_BASE_URL;
const SWIL_API_KEY = process.env.SWIL_API_KEY;

// Headers for SwilERP API
const headers = {
  Authorization: `Bearer ${SWIL_API_KEY}`,
  "Content-Type": "application/json",
};

const createOrder = async (orderData) => {
  try {
    // Validate required fields
    validateOrderData(orderData);

    // Calculate pricing
    const pricing = calculatePricing(
      orderData.products,
      orderData.pricing?.discount || 0
    );

    orderData.pricing = pricing;

    // Create SwilERP order first
    const swilERPPayload = transformToSwilERPFormat(orderData);
    const swilERPResponse = await createSwilERPOrder(swilERPPayload);

    if (swilERPResponse.ErrorMessage?.length > 0) {
      throw new ValidationError(swilERPResponse.ErrorMessage[0]);
    }

    // Validate SwilERP response
    if (
      !swilERPResponse.ApiResponse?.ID ||
      !Number.isInteger(swilERPResponse.ApiResponse.ID) ||
      swilERPResponse.ApiResponse.ID <= 0
    ) {
      throw new ValidationError("Invalid SwilERP order ID received");
    }

    // Prepare Crudo order data
    const orderPayload = {
      swilOrderId: parseInt(swilERPResponse.ApiResponse.ID), // Ensure integer
      orderStatus: "PENDING",
      customer: {
        ...orderData.customer,
        customerId: parseInt(orderData.customer.customerId), // Ensure integer
      },
      products: orderData.products.map((product) => ({
        ...product,
        productId: parseInt(product.productId), // Ensure integer
      })),
      payment: orderData.payment,
      pricing: pricing,
      orderStatusHistory: [
        {
          status: "PENDING",
          timestamp: new Date(),
        },
      ],
    };

    // Create order in Crudo Platform
    const crudoOrder = await Order.create(orderPayload);
    return {
      crudoOrder,
      swilERPResponse: swilERPResponse.ApiResponse,
    };
  } catch (error) {
    handleOrderError(error);
  }
};

const validateOrderData = (orderData) => {
  if (!orderData.customer || !orderData.products || !orderData.payment) {
    throw new ValidationError("Missing required order data");
  }

  if (!orderData.products.length) {
    throw new ValidationError("Order must contain at least one product");
  }

  if (!["COD", "UPI"].includes(orderData.payment.method)) {
    throw new ValidationError("Invalid payment method");
  }
};

const calculatePricing = (products, discount = 0) => {
  const subtotal = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  // Ensure discount is a number and not greater than subtotal
  const validDiscount = Math.min(Number(discount) || 0, subtotal);

  const totalAmount = Math.max(0, subtotal - validDiscount);

  return {
    subtotal: subtotal,
    discount: validDiscount,
    totalAmount: totalAmount,
  };
};

const createSwilERPOrder = async (payload) => {
  try {
    const response = await axios.post(
      `${SWIL_API_BASE_URL}/api/transaction/salesorder/CreateSalesOrdMobile`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new UnauthorizedError("Invalid SwilERP API key");
    }
    throw new InternalServerError(
      `SwilERP API Error: ${error.response?.data?.message || error.message}`
    );
  }
};

const transformToSwilERPFormat = (orderData) => {
  return {
    ApplyPromotion: false,
    DraftMode: 0,
    FKPartyID: orderData.customer.customerId,
    FKReferByID: 0,
    FKSalesPerID: 0,
    FKSeriesID: 10000058, // Using the series ID from your example
    Party: orderData.customer.name,
    ProdDtl: orderData.products.map((product) => ({
      Batch: product.batch || "", // Add batch if available
      FKLotID: 0,
      FKProdID: product.productId,
      MRP: product.price,
      Qty: product.quantity,
      QtyUnit: 1,
      Rate: product.price,
    })),
  };
};

const handleOrderError = (error) => {
  if (error.name === "ValidationError") {
    throw new ValidationError(error.message);
  }
  if (error.name === "UnauthorizedError") {
    throw error;
  }
  if (error.name === "ValidationError") {
    throw error;
  }
  console.error("Order creation error:", error);
  throw new InternalServerError("Failed to create order");
};

const getAllOrders = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1, filters = {}) => {
  try{
    const query = {};

    if(filters.startDate || filters.endDate){
      query.createdAt = {};
      if(filters.starDate){
        query.createdAt.$gte = new Date(filters.starDate);
      }

      if(filters.endDate){
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    if(filters.orderStatus){
      query.orderStatus = filters.orderStatus.toUpperCase();
    }

    if(filters.customerId){
      query['customer.customerId'] = parseInt(filters.customerId);
    }

    const skip = (page-1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder;

    const orders = await Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
        hasMore: page * limit < total
      }
    };
  } catch(error){
    throw new InternalServerError(`Failed to fetch orders: ${error.message}`);
  }
}

module.exports = {
  createOrder,
  getAllOrders
};
