const { connectToDatabase } = require("../../config/dbConn.js");

const createRent = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Rent");
  if (
    !req.body.owner ||
    !req.body.phone ||
    !req.body.type ||
    !req.body.location ||
    !req.body.photos ||
    !req.body.description ||
    !req.body.price
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
  if (req.query.owner) query.owner = req.query.owner;
  if (req.query.phone) query.phone = req.query.phone;
  let result;
  Object.keys(query).length === 0
    ? (result = await collection.find({}, { projection: { _id: 0 } }).toArray())
    : (result = await collection.findOne(query, { projection: { _id: 0 } }));

  res.json(result);
};

module.exports = {
  createRent,
  getRent,
};
