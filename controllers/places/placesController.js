const { connectToDatabase } = require("../../config/dbConn.js");

const createPlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");
  const { name, photos } = req.body;
  if (!name || !photos) {
    return res.status(400).json({
      message: "Name and photo of the place is required",
    });
  }
  const itemsArray = photos.split(",");

  const duplicate = await collection.findOne({ name });
  if (duplicate) {
    return res.status(401).json({ message: "Duplicated place" });
  }
  const result = await db.collection("Places").insertOne({
    name,
    photos: itemsArray,
  });
  return res.status(201).json({ message: "Place created successfully" });
};

const updatePlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");
  const data = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const place = await collection.findOne({ name: req.params.name });

  if (!place) {
    return res.status(400).json({ message: "Place not found" });
  }
  const updateFields = {};
  for (const key in data) {
    if (data[key] !== place[key]) {
      updateFields[key] = data[key];
    }
  }
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Provide a different user data" });
  }
  const result = await collection.updateOne(
    { name: req.params.name },
    {
      $set: updateFields,
    }
  );

  return res.status(200).json({ message: "Place updated successfully" });
};

module.exports = { createPlace, updatePlace };
