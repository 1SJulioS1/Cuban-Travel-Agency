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

module.exports = { createPlace };
