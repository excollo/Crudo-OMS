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
    // First validate the order data
    validateOrderData(orderData);

    // Calculate pricing
    const pricing = calculatePricing(
      orderData.products,
      orderData.pricing?.discount || 0
    );

    // Create complete order data
    const completeOrderData = {
      ...orderData,
      pricing, // This includes subtotal, discount, and totalAmount
      customer: {
        ...orderData.customer,
        customerId: parseInt(orderData.customer.customerId),
        age: parseInt(orderData.customer.age),
      },
    };

    // Create SwilERP order first
    const swilERPPayload = transformToSwilERPFormat(completeOrderData);
    const swilERPResponse = await createSwilERPOrder(swilERPPayload);

    if (swilERPResponse.ErrorMessage?.length > 0) {
      throw new ValidationError(swilERPResponse.ErrorMessage[0]);
    }

    // Prepare Crudo order data with validated pricing
    const orderPayload = {
      swilOrderId: parseInt(swilERPResponse.ApiResponse.ID),
      swilSeriesId: completeOrderData.swilSeriesId,
      orderStatus: "PENDING",
      customer: completeOrderData.customer,
      products: completeOrderData.products,
      payment: completeOrderData.payment,
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
      success: true,
      data: {
        crudoOrder,
        swilERPResponse: swilERPResponse.ApiResponse,
      },
    };
  } catch (error) {
    handleOrderError(error);
  }
};

const validateOrderData = (orderData) => {
  // Basic required fields validation
  if (!orderData.customer || !orderData.products || !orderData.payment) {
    throw new ValidationError("Missing required order data");
  }

  // Customer validation
  const requiredCustomerFields = [
    "customerId",
    "name",
    "email",
    "phone",
    "address",
    "age",
    "sex",
  ];
  requiredCustomerFields.forEach((field) => {
    if (!orderData.customer[field]) {
      throw new ValidationError(`Customer ${field} is required`);
    }
  });

  // Products validation
  if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
    throw new ValidationError("Order must contain at least one product");
  }

  orderData.products.forEach((product, index) => {
    if (
      !product.productId ||
      !product.name ||
      !product.quantity ||
      !product.price
    ) {
      throw new ValidationError(`Invalid product data at index ${index}`);
    }

    // Convert string numbers to actual numbers
    product.productId = parseInt(product.productId);
    product.quantity = parseInt(product.quantity);
    product.price = parseFloat(product.price);

    if (product.quantity < 1) {
      throw new ValidationError(
        `Product quantity must be at least 1 at index ${index}`
      );
    }
    if (product.price < 0) {
      throw new ValidationError(
        `Product price cannot be negative at index ${index}`
      );
    }
  });

  // Payment validation
  if (!["COD", "UPI"].includes(orderData.payment.method)) {
    throw new ValidationError("Invalid payment method");
  }

  // SwilERP Series ID validation
  if (!orderData.swilSeriesId) {
    throw new ValidationError("SwilERP Series ID is required");
  }
  orderData.swilSeriesId = parseInt(orderData.swilSeriesId);

  return true;
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
    FKSeriesID: orderData.swilSeriesId, // Using the series ID from your example
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

    const ordersWithStatus = await Promise.all(
      orders.map(async (order) => {
        try {
          const swilERPStatus = await getSwilERPOrderStatus(
            order.swilOrderId,
            order.swilSeriesId
          );
          if (swilERPStatus && swilERPStatus.status !== order.orderStatus) {
            // First check if this status update already exists
            const lastStatus =
              order.orderStatusHistory[order.orderStatusHistory.length - 1];
            if (
              !lastStatus ||
              lastStatus.status !== swilERPStatus.status ||
              lastStatus.timestamp.getTime() !==
                new Date(swilERPStatus.statusDetails.lastModified).getTime()
            ) {
              // Update the order status in database
              await Order.updateOne(
                {
                  swilOrderId: order.swilOrderId,
                  // Add condition to prevent duplicate status entries
                  "orderStatusHistory.status": { $ne: swilERPStatus.status },
                },
                {
                  $set: { orderStatus: swilERPStatus.status },
                  $push: {
                    orderStatusHistory: {
                      status: swilERPStatus.status,
                      timestamp: new Date(
                        swilERPStatus.statusDetails.lastModified
                      ),
                    },
                  },
                }
              );
            }

            // Return modified order with status details
            return {
              ...order,
              orderStatus: swilERPStatus.status,
              swilERPStatusDetails: swilERPStatus.statusDetails,
            };
          }
          // Return original order without additional status details
          return {
            ...order,
            swilERPStatusDetails: null,
          };
        } catch (error) {
          console.error(
            `Failed to fetch status for order ${order.swilOrderId}:`,
            error.message
          );
          return {
            ...order,
            swilERPStatusDetails: null,
          };
        }
      })
    );

    const total = await Order.countDocuments(query);

    return {
      orders: ordersWithStatus,
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

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findOne({
      swilOrderId: parseInt(orderId),
    })
      .lean()
      .exec();

    if (!order) {
      throw new ValidationError("Order not found");
    }

    const swilERPStatus = await getSwilERPOrderStatus(
      order.swilOrderId,
      order.swilSeriesId
    );

    if (swilERPStatus) {
      // Create a simplified status history object that matches the structure
      const statusHistory = [
        {
          status: swilERPStatus.status,
          details: {
            currentStatus: swilERPStatus.statusDetails.currentStatus,
            nextStatus: swilERPStatus.statusDetails.nextStatus,
            lastModified: swilERPStatus.statusDetails.lastModified,
            remarks: swilERPStatus.statusDetails.remarks,
            employee: swilERPStatus.statusDetails.employee,
            timeLog: extractTimeLog(swilERPStatus.statusDetails.remarks),
          },
        },
      ];

      const latestStatus = statusHistory[0];
      if (latestStatus && latestStatus.status !== order.orderStatus) {
        const lastStatus =
          order.orderStatusHistory[order.orderStatusHistory.length - 1];
        if (
          !lastStatus ||
          lastStatus.status !== latestStatus.status ||
          lastStatus.timestamp.getTime() !==
            new Date(latestStatus.details.lastModified).getTime()
        ) {
          await Order.updateOne(
            {
              swilOrderId: order.swilOrderId,
              "orderStatusHistory.status": { $ne: latestStatus.status },
            },
            {
              $set: { orderStatus: latestStatus.status },
              $push: {
                orderStatusHistory: {
                  status: latestStatus.status,
                  timestamp: new Date(latestStatus.details.lastModified),
                },
              },
            }
          );
        }
      }

      return {
        ...order,
        currentStatus: latestStatus?.status || order.orderStatus,
        swilERPStatusHistory: statusHistory,
        swilERPLatestStatus: latestStatus?.details || null,
      };
    }

    return order;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ValidationError(error.message);
    }
    throw new InternalServerError(`Failed to fetch order: ${error.message}`);
  }
};

// Helper function to extract time log from remarks
const extractTimeLog = (remarkString) => {
  try {
    if (!remarkString) return null;
    const remarkObj = JSON.parse(remarkString);
    return remarkObj.TimeLog || null;
  } catch {
    return null;
  }
};

const getSwilERPOrderStatus = async (orderId, seriesId) => {
  try{
    const response = await axios.post(
      `${SWIL_API_BASE_URL}/api/report/OrderFullfillment/GetTranStatusData`,
      null,
      {
        headers,
        params: {
          PKID: orderId,
          SeriseId: seriesId
        }
      }
    );

    if(response.data.Status === "success" && response.data.Data?.Table?.length > 0){
      const latestStatus = response.data.Data.Table[0];
      return {
        status: latestStatus.StatusCategory,
        statusDetails: {
          currentStatus: latestStatus.Status,
          nextStatus: latestStatus.nextStatusCategory,
          lastModified: latestStatus.DATE_MODIFIED,
          remarks: latestStatus.Remark,
          employee: latestStatus.Employee
        }
      }
    }
    return null;
  } catch(error){
    throw new InternalServerError(`Failed to fetch SwilERP order status: ${error.message}`);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById
};
