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
const getInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  let query = {};
  if (req.query?.name) query.name = req.query.name;
  if (req.query?.name) query.phone = req.query.phone;
  let result;
  console.log(query);
  Object.keys(query).length === 0
    ? (result = await collection.find({}, { projection: { _id: 0 } }).toArray())
    : (result = await collection.findOne(query, { projection: { _id: 0 } }));

  res.json(result);
};

const removeInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.query?.name || !req.query?.phone) {
    res.status(400).json({ message: "Interpreter parameters are required" });
  }
  const { name, phone } = req.query;

  const result = await collection.deleteOne({ name, phone });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.status(200).json({ message: "Document deleted successfully" });
};
const updateInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.query?.name && !req.query?.phone) {
    return res.status(400).json({ message: "Update parameters are required" });
  }
  const interpreter = await collection.findOne(req.query);
  if (!interpreter) {
    return res.status(400).json({ message: "Interpreter  not found" });
  }
  const interpreterData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const updateFields = {};
  for (const key in interpreterData) {
    if (interpreterData[key] !== interpreter[key]) {
      updateFields[key] = interpreterData[key];
    }
  }
  if (Object.keys(updateFields).length === 0) {
    return res
      .status(400)
      .json({ message: "Provide a different interpreter data" });
  }

  const result = await collection.updateOne(req.query, { $set: updateFields });
  return res
    .status(200)
    .json({ message: "Interpreter service updated successfully" });
};
const getInterpreterTours = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.params.interpreterId) {
    return res.status(400).json({ message: "Interpreter Id data is required" });
  }
  if (!ObjectId.isValid(req.params.interpreterId)) {
    return res.status(400).json({ message: "Invalid Interpreter ID" });
  }
  const interpreterWithTours = await collection
    .aggregate([
      { $match: { _id: req.params.interpreterId } },
      {
        $lookup: {
          from: "Tour",
          localField: "_id",
          foreignField: "interpreters",
          as: "tours",
        },
      },
    ])
    .toArray();

  if (interpreterWithTours.length === 0) {
    return res.status(404).json({ message: "Interpreter not found" });
  }
  res.status(200).json(interpreterWithTours[0]);
};
module.exports = {
  createInterpreter,
  getInterpreter,
  removeInterpreter,
  updateInterpreter,
  getInterpreterTours,
};
