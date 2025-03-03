const authService = require("../services/authService");
const authLogger = require("../loggers/authLogger");

const signup = async (req, res) => {
    try {
      const user = await authService.signup(req.body);
      authLogger.info(`User signed up: ${user.email}`);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      authLogger.error(`Signup error: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signup
}