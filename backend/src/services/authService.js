const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (userData) => {
    const userExists = await User.findOne({email: userData.email});
    if(userExists) throw new Error("User already Exists");
    const user = await User.create(userData);
    return user;
}

module.exports = {
    signup
}