const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  try {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || "1d",
    });
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new Error("Token generation failed");
  }
};

const generateRefreshToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Token generation failed");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
