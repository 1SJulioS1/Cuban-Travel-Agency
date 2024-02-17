const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../config/dbConn.js");

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

      try {
        const db = await connectToDatabase();
        const collection = db.collection("User");
        const result = await collection.findOne({
          email: decodedToken.UserInfo.email,
        });
        if (
          !decodedToken.UserInfo.role.includes(5150) &&
          result._id.toString() !== req.params.id
        ) {
          return res
            .status(401)
            .json({ message: "You don't have the necessary permissions " })
            .end();
        }
        next();
      } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: "An error occurred." }).end();
      }
    }
  );
};

module.exports = verifySelfOrAdministrator;
