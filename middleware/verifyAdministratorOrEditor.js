const jwt = require("jsonwebtoken");
const ROLE_LIST = require("../config/rolesList");
const verifyAdministratorOrEditor = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token");
    return res.sendStatus(403).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      console.log("403");
      return res.sendStatus(403).json({ message: "Invalid token" });
    }

    const rolesToCheck =
      typeof decodedToken.UserInfo.role == "string"
        ? [ROLE_LIST.Admin.toString(), ROLE_LIST.Editor.toString()]
        : [ROLE_LIST.Admin, ROLE_LIST.Editor];

    if (
      !rolesToCheck.some((role) => decodedToken.UserInfo.role.includes(role))
    ) {
      console.log("No permission");
      return res
        .sendStatus(401)
        .json({ message: "You don't have the necessary permissions" });
    }
    next();
  });
};

module.exports = verifyAdministratorOrEditor;
