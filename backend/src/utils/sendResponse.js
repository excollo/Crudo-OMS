const sendResponse = (res, statusCode, message, data = null) => {
  const responseBody = { message };
  if (data) {
    responseBody.data = data;
  }
  res.status(statusCode).json(responseBody);
};

module.exports = {
  sendResponse
}