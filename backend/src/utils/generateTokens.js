const {jwtConfig} = require("../config/config");

console.log("JWT CONFIG LOADED:", jwtConfig);

const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
