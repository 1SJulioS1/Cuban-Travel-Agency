const jwt = require("jsonwebtoken");
const ROLE_LIST = require("../config/rolesList");
const verifyAdministrator = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (!decodedToken.UserInfo.role.includes(ROLE_LIST.Admin)) {
      return res
        .status(401)
        .json({ message: "You don't have the necessary permissions " });
    }

    next();
  });
};

module.exports = verifyAdministrator;
