const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer"))
    return res.sendStatus(401).json({ message: "You are not authorized " });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.sendStatus(403).json({ message: "Your token is invalid" });
    req.user = decoded.UserInfo.email;
    req.roles = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
