const axios = require("axios");
const {
  UnauthorizedError,
  InternalServerError,
} = require("../utils/customErrors");

const SWIL_API_KEY = process.env.SWIL_API_KEY;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${SWIL_API_KEY}`,
};

const fetchCustomerList = async (pageNo = 1, pageSize = -1, search = "") => {
  try {
    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/customer/List`,
      {},
      {
        headers,
        params: { pageno: pageNo, pagesize: pageSize, search },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const fetchCustomerById = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/Customer/GetByIDMob`,
      {},
      {
        headers,
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const createCustomer = async (customerData) => {
  try {
    // Ensure the data is in the format expected by SwilERP API
    const swilERPCustomerData = {
      Customer: customerData.Customer,
      Email: customerData.Email,
      Mobile: customerData.Mobile,
      Address: customerData.Address,
      Pincode: customerData.Pincode,
      Alias: customerData.Alias,
      Station: customerData.Station,
      Druglicence: customerData.Druglicence || "",
      Gstno: customerData.Gstno === null ? "" : (customerData.Gstno || ""),
      PanNo: customerData.PanNo === null ? "" : (customerData.PanNo || ""),
    };

    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/customer/CreateCustomerMobile`,
      swilERPCustomerData,
      { headers }
    );

    if (response.data.ID === 0 && response.data.Response.includes("Error")) {
      throw new Error(response.data.Response);
    }

    return response.data;
  } catch (error) {
    if (error.message.includes("Error:")) {
      throw new Error(error.message);
    }
    handleAxiosError(error);
  }
};

const updateCustomer = async (id, customerData) => {
  try {
    const swilERPUpdateCustomerData = {
      PKID: parseInt(id),
      Address: customerData.address || customerData.Address,
      Customer: customerData.fullname || customerData.Customer,
      Email: customerData.email || customerData.Email,
      Mobile: customerData.phoneNumber || customerData.Mobile,
      Alias: customerData.alias || customerData.Alias,
      Pincode: customerData.pincode || customerData.Pincode,
      Station: customerData.station || customerData.Station,
      Druglicence: customerData.Druglicence || "",
      Gstno: customerData.Gstno === null ? "" : (customerData.Gstno || ""),
      PanNo: customerData.PanNo === null ? "" : (customerData.PanNo || ""),
    };
    

    const response = await axios.post(
      `${process.env.SWILERP_BASE_URL}/api/master/customer/UpdateMobile`,
      swilERPUpdateCustomerData,
      { headers }
    );

    if (response.data.ID === 0 && response.data.Response?.includes("Error")) {
      throw new Error(response.data.Response);
    }

    return response.data;
  } catch (error) {
    if (error.response?.data?.Response) {
      throw new Error(error.response.data.Response);
    }
    if (error.message.includes("Error:")) {
      throw new Error(error.message);
    }
    handleAxiosError(error);
  }
};

const handleAxiosError = (error) => {
  if (error.response && error.response.status === 401) {
    throw new UnauthorizedError("Invalid token");
  }
  throw new InternalServerError("Failed to fetch data from SwilERP");
};

module.exports = {
  fetchCustomerList,
  fetchCustomerById,
  createCustomer,
  updateCustomer
};
