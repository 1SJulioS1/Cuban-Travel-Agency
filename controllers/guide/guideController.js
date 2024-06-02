const { connectToDatabase } = require("../../config/dbConn.js");

const createGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.body.name || !req.body.phone) {
    return res.status(400).json({ message: "Guide parameters are required" });
  }
  const guideData = req.body;
  const duplicate = await collection.findOne({
    name: guideData.name,
    phone: guideData.phone,
  });
  if (duplicate) {
    return res.status(401).json({ message: "Duplicated guide" });
  }
  const result = await collection.insertOne(guideData);
  res.status(201).json({
    message: "Guide created successfully",
  });
};
const getGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  let query = {};
  if (req.query?.owner) query.name = req.query.name;
  if (req.query?.phone) query.phone = req.query.phone;
  let result;
  Object.keys(query).length === 0
    ? (result = await collection.find({}, { projection: { _id: 0 } }).toArray())
    : (result = await collection.findOne(query, { projection: { _id: 0 } }));

  res.json(result);
};
const removeGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.query?.name || !req.query?.phone) {
    return res.status(400).json({ message: "Rent parameters are required" });
  }
  const { name, phone } = req.query;

  const result = await collection.deleteOne({ name, phone });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.status(200).json({ message: "Document deleted successfully" });
};

const updateGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.query?.name && !req.query?.phone) {
    return res.status(400).json({ message: "Update parameters are required" });
  }
  const guide = await collection.findOne(req.query);
  if (!guide) {
    return res.status(400).json({ message: "Guide not found" });
  }
  const guideData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const updateFields = {};
  for (const key in guideData) {
    if (guideData[key] !== guide[key]) {
      updateFields[key] = guideData[key];
    }
  }
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Provide a different guide data" });
  }

  const result = await collection.updateOne(req.query, { $set: updateFields });
  return res.status(200).json({ message: "Guide updated successfully" });
};

const getGuideTours = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.params.guideId) {
    return res.status(400).json({ message: "Guide Id data is required" });
  }
  if (!ObjectId.isValid(req.params.guideId)) {
    return res.status(400).json({ message: "Invalid Guide ID" });
  }
  const guideWithTours = await collection
    .aggregate([
      { $match: { _id: req.params.guideId } },
      {
        $lookup: {
          from: "Tour",
          localField: "_id",
          foreignField: "guides",
          as: "tours",
        },
      },
    ])
    .toArray();

  if (guideWithTours.length === 0) {
    return res.status(404).json({ message: "Guide not found" });
  }
  res.status(200).json(guideWithTours[0]);
};
module.exports = {
  createGuide,
  getGuide,
  removeGuide,
  updateGuide,
  getGuideTours,
};
