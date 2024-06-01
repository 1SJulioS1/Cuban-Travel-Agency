const { connectToDatabase } = require("../../config/dbConn.js");

const createRent = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Rent");
  if (
    !req.body?.owner ||
    !req.body?.phone ||
    !req.body?.type ||
    !req.body?.location ||
    !req.body?.photos ||
    !req.body?.description ||
    !req.body?.price
  ) {
    res.status(400).json({ message: "Rent parameters are required" });
  }
  const rentData = req.body;
  const duplicate = await collection.findOne({
    owner: rentData.owner,
    phone: rentData.phone,
  });
  if (duplicate) {
    return res.status(401).json({ message: "Duplicated rent service" });
  }
  const result = await collection.insertOne(rentData);
  res.status(201).json({
    message: "Rent created successfully",
  });
};
const getRent = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Rent");
  let query = {};
  if (req.query?.owner) query.owner = req.query.owner;
  if (req.query?.phone) query.phone = req.query.phone;
  let result;
  Object.keys(query).length === 0
    ? (result = await collection.find({}, { projection: { _id: 0 } }).toArray())
    : (result = await collection.findOne(query, { projection: { _id: 0 } }));

  res.json(result);
};
const removeRent = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Rent");
  if (!req.query?.owner || !req.query?.phone) {
    res.status(400).json({ message: "Rent parameters are required" });
  }
  const { owner, phone } = req.query;

  const result = await collection.deleteOne({ owner, phone });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.status(200).json({ message: "Document deleted successfully" });
};

const updateRent = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Rent");
  if (!req.query?.owner && !req.query?.phone) {
    return res.status(404).json({ message: "Update parameters are required" });
  }
  const rent = await collection.findOne(req.query);
  if (!rent) {
    return res.status(400).json({ message: "Rent service not found" });
  }
  const rentData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const updateFields = {};
  for (const key in rentData) {
    if (rentData[key] !== rent[key]) {
      updateFields[key] = rentData[key];
    }
  }
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Provide a different rent data" });
  }

  const result = await collection.updateOne(req.query, { $set: updateFields });
  return res.status(200).json({ message: "Rent service updated successfully" });
};

module.exports = {
  createRent,
  getRent,
  removeRent,
  updateRent,
};
