const { connectToDatabase } = require("../../config/dbConn.js");
const createInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.body?.name || !req.body?.phone || !req.body?.history) {
    res.status(400).json({ message: "Interpreter data is required" });
  }
  const interpreterData = req.body;
  const duplicate = await collection.findOne({
    name: interpreterData.name,
    phone: interpreterData.phone,
  });
  if (duplicate) {
    return res.status(401).json({ message: "Duplicated rent service" });
  }
  const result = await collection.insertOne(interpreterData);
  res.status(201).json({
    message: "Interpreter created successfully",
  });
};
const getInterpreter = async (req, res) => {};
const removeInterpreter = async (req, res) => {};
const updateInterpreter = async (req, res) => {};

module.exports = {
  createInterpreter,
  getInterpreter,
  removeInterpreter,
  updateInterpreter,
};
