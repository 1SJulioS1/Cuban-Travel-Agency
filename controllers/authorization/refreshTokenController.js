const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../../config/dbConn.js");

const handleRefreshToken = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("User");
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  const foundUser = await collection.findOne({ refreshToken });
  if (!foundUser) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) {
      return res.sendStatus(403);
    }
    const role = foundUser.role;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: decoded.email,
          role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    return res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
