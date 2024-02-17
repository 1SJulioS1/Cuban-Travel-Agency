const { connectToDatabase } = require("../../config/dbConn.js");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  const db = await connectToDatabase();
  const collection = db.collection("User");
  if (!cookies?.jwt) {
    return res.status(400).json({ message: "No cookies found" });
  }

  const refreshToken = cookies.jwt;
  const foundUser = await collection.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    console.log("Cookie deleted");
    return res.status(400).json({ message: "User not found" });
  }
  const result = await collection.updateOne(
    { _id: foundUser._id },
    { $set: { refreshToken: "" } }
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.status(204).json({ message: "Logout successfully" });
};

module.exports = { handleLogout };
