const { connectToDatabase } = require("../../config/dbConn.js");

const createGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.body.name || !req.body.phone) {
    return res
      .status(400)
      .json({ message: "Guide name and phone are required" });
  }
  const allowedFields = ["name", "phone", "email", "history"];
  validateFields("body", allowedFields)(req, res, async () => {
    const duplicate = await collection.findOne({
      name: guideData.name,
      phone: guideData.phone,
    });
    if (duplicate) {
      return res.status(401).json({ message: "Duplicated guide" });
    }
    const guideData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || null,
      history: req.body.history || null,
    };
    const result = await collection.insertOne(guideData);
    return res.status(201).json({
      message: "Guide created successfully",
    });
  });
};
const getGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (Object.keys(req.query).length === 0) {
    const result = await collection.find({}).toArray();
    return res.json(result);
  } else {
    if (!req.query?.name || !req.query?.phone) {
      return res
        .status(400)
        .json({ message: "Guide name and phone are required" });
    }
    const allowedFields = ["name", "phone"];
    validateFields("query", allowedFields)(req, res, async () => {
      result = await collection.findOne({
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
const removeGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.query?.name || !req.query?.phone) {
    return res
      .status(400)
      .json({ message: "Guide name and phone are required" });
  }
  const allowedFields = ["name", "phone"];
  validateFields("query", allowedFields)(req, res, async () => {
    const result = await collection.deleteOne({
      name: req.name,
      phone: req.phone,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json({ message: "Document deleted successfully" });
  });
};

const updateGuide = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Guide");
  if (!req.query?.name && !req.query?.phone) {
    return res.status(400).json({ message: "Update parameters are required" });
  }

  const allowedFields = ["name", "phone"];
  validateFields("query", allowedFields)(req, res, async () => {
    const allowedFields = ["name", "photos"];
    validateFields("body", allowedFields)(req, res, async () => {
      const guide = await collection.findOne(req.query);
      if (!guide) {
        return res.status(400).json({ message: "Guide not found" });
      }
      const guideData = req.body;

      const updateFields = {};
      for (const key in guideData) {
        if (guideData[key] !== guide[key]) {
          updateFields[key] = guideData[key];
        }
      }
      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "Provide a different guide data" });
      }
      const result = await collection.updateOne(req.query, {
        $set: updateFields,
      });
      return res.status(200).json({ message: "Guide updated successfully" });
    });
  });
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
  return res.status(200).json(guideWithTours[0]);
};
module.exports = {
  createGuide,
  getGuide,
  removeGuide,
  updateGuide,
  getGuideTours,
};
