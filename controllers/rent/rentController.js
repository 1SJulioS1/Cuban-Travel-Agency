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

module.exports = {
  createRent,
};
