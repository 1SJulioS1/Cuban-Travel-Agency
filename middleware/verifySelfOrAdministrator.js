const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../config/dbConn");
const ROLE_LIST = require("../config/rolesList");

const verifySelfOrAdministrator = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(403).json({ message: "No token provided" }).end();

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decodedToken) => {
      if (err) return res.status(403).json({ message: "Invalid token" }).end();

      const db = await connectToDatabase();
      const collection = db.collection("User");
      const result = await collection.findOne({
        email: decodedToken.UserInfo.email,
      });
      if (
        !decodedToken.UserInfo.role.includes(ROLE_LIST.Admin) &&
        result._id.toString() !== req.params.id
      ) {
        return res
          .status(401)
          .json({ message: "You don't have the necessary permissions " })
          .end();
      }
      next();
    }
  );
};

module.exports = verifySelfOrAdministrator;
