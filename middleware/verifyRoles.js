const jwt = require("jsonwebtoken");

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.sendStatus(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403).json({ message: "Invalid token" });

      req.role = user.UserInfo.role;

      const rolesArray = [...allowedRoles];

      const result = req.role
        .map((role) => rolesArray.includes(role))
        .find((val) => val === true);

      if (!result)
        return res
          .sendStatus(401)
          .json({ message: "You don't have the necessary permissions " });

      next();
    });
  };
};

module.exports = verifyRoles;
