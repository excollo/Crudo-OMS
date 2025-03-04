const jwt = require('jsonwebtoken');
const {jwtConfig} = require("../config/config");

const verifyToken = (req,res,next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token) return res.status(401).json({
        error: "Unauthorized"
    })

    try{
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(403).json({
            error: "Invalid Token"
        });
    }
}

module.exports = {
    verifyToken
}