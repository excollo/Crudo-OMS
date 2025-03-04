const { jwtConfig } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new Error("User already Exists");
  const user = await User.create(userData);
  return user;
};

const signin = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign({ id: user._id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  const refreshToken = jwt.sign({ id: user._id }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

  return { user, accessToken, refreshToken };
};

const refreshToken = async (token) => {
  const decoded = jwt.verify(token, jwtConfig.refreshSecret);
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
  const refreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    }
  );
  return { accessToken, refreshToken };
};

module.exports = {
  signup,
  signin,
  refreshToken,
};
