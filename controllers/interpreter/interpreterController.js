const { connectToDatabase } = require("../../config/dbConn.js");
const createInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.body.name || !req.body.phone) {
    return res
      .status(400)
      .json({ message: "Interpreter name and phone are required" });
  }
  const allowedFields = ["name", "phone", "email", "history"];
  validateFields("body", allowedFields)(req, res, async () => {
    const duplicate = await collection.findOne({
      name: req.body.name,
      phone: req.body.phone,
    });
    if (duplicate) {
      return res.status(401).json({ message: "Duplicated place" });
    }
    const result = await collection.insertOne({
      name: req.body.name,
      phone: req.body.phone,
      tours: [],
    });
    return res.status(201).json({
      message: "Interpreter created successfully",
    });
  });
};

const getInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (Object.keys(req.query).length === 0) {
    const result = await collection.find({}).toArray();
    return res.json(result);
  } else {
    if (!req.query?.name || !req.query?.phone) {
      return res
        .status(400)
        .json({ message: "Interpreter name and phone are required" });
    }
    const allowedFields = ["name", "phone"];
    validateFields("query", allowedFields)(req, res, async () => {
      const result = await collection.findOne({
        name: req.query.name,
        phone: req.query.phone,
      });
      if (!result) {
        return res
          .status(400)
          .json({ message: `Place with name ${req.query.name} not found` });
      }
      return res.json(result);
    });
  }
};

const removeInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.query?.name || !req.query?.phone) {
    res
      .status(400)
      .json({ message: "Interpreter name and phone are required" });
  }
  if (Object.keys(req.body).length !== 2) {
    return res.status(400).json({ message: "Invalid query parameter" });
  }
  const { name, phone } = req.query;

  const result = await collection.deleteOne({ name, phone });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Document not found" });
  }

  return res.status(200).json({ message: "Document deleted successfully" });
};
const updateInterpreter = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Interpreter");
  if (!req.query?.name && !req.query?.phone) {
    return res.status(400).json({ message: "Update parameters are required" });
  }
  const allowedFields = ["name", "phone"];
  validateFields("body", allowedFields)(req, res, async () => {
    const interpreter = await collection.findOne(req.query);
    if (!interpreter) {
      return res.status(400).json({ message: "Interpreter  not found" });
    }
    const interpreterData = req.body;

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
    const result = await collection.updateOne(req.query, {
      $set: updateFields,
    });
    return res
      .status(200)
      .json({ message: "Interpreter service updated successfully" });
  });
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
  return res.status(200).json(interpreterWithTours[0]);
};
module.exports = {
  createInterpreter,
  getInterpreter,
  removeInterpreter,
  updateInterpreter,
  getInterpreterTours,
};
