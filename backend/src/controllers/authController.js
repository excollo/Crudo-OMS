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

const signin = async (req, res) => {
    try {
       const { user, accessToken, refreshToken } = await authService.signin(
         req.body
       );
       authLogger.info(`User logged in: ${user.email}`);
       res.json({ user, accessToken, refreshToken });
     } catch (error) {
       authLogger.error(`Signin error: ${error.message}`);
       res.status(401).json({ error: error.message });
    }
}

module.exports = {
    signup,
    signin
}