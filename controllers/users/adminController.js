const { connectToDatabase } = require("../../config/dbConn.js");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const getAllUsersByRole = async (req, res) => {
  if (!req?.body?.role) {
    return res.status(400).json({ message: "User role is required" });
  }
  try {
    const db = await connectToDatabase();
    const collection = db.collection("User");

    const users = await collection
      .find(
        { role: parseInt(req.body.role) },
        { projection: { _id: 0, username: 1, email: 1 } }
      )
      .toArray();
    if (!users) return res.status(404).json({ message: "No users found" });
    res.json(users);
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = { getAllUsersByRole };
