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

const refreshToken = async (req,res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Call the service to generate new tokens
    const tokens = await authService.refreshToken(refreshToken);

    if (!tokens) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    res.json(tokens);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    await authService.logout(req.user.id, refreshToken);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try{
    await authService.requestPasswordReset(req.body.email);
    res.json({
      message: "Password reset link sent"
    })
  }
  catch(error){
    res.status(500).json({
      error: error.message
    })
  }
}


module.exports = {
    signup,
    signin,
    refreshToken,
    logout,
    requestPasswordReset
}