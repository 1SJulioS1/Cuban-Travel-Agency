const { connectToDatabase } = require("../../config/dbConn.js");
const validateFields = require("../../middleware/verifyFields.js");

const createPlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");
  if (!req.body.name || !req.body.photos) {
    return res
      .status(400)
      .json({ message: "Place name and photos(s) are required" });
  }

  const allowedFields = ["name", "photos"];
  validateFields("body", allowedFields)(req, res, async () => {
    const duplicate = await collection.findOne({ name: req.body.name });
    if (duplicate) {
      return res.status(401).json({ message: "Duplicated place" });
    }
    const itemsArray = req.body.photos.trim().split(",");

    const result = await db.collection("Places").insertOne({
      name: req.body.name,
      photos: itemsArray,
      tours: [],
    });
    return res.status(201).json({ message: "Place created successfully" });
  });
};

const updatePlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");
  if (!req.query.name) {
    return res.status(400).json({ message: "Place is required" });
  }

  const allowedFields = ["name"];
  validateFields("query", allowedFields)(req, res, async () => {
    var data = req.body;
    const allowedFields = ["name", "photos"];
    validateFields("body", allowedFields)(req, res, async () => {
      const place = await collection.findOne({ name: req.query.name });

      if (!place) {
        return res.status(400).json({ message: "Place not found" });
      }

      if (data.photos) {
        data.photos = data.photos.split(",").map((photo) => photo.trim());
      }

      const isSamePhotos =
        JSON.stringify(place.photos) === JSON.stringify(data.photos);

      if (isSamePhotos) {
        return res.status(200).json({ message: "No changes detected" });
      }

      const result = await collection.updateOne(
        { name: req.query.name },
        {
          $set: data,
        }
      );
      return res.status(200).json({ message: "Place updated successfully" });
    });
  });
};

const removePlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");

  if (!req?.query?.name) {
    return res.status(400).json({ message: "Name parameter is required" });
  }
  const allowedFields = ["name"];
  validateFields("query", allowedFields)(req, res, async () => {
    const user = await collection.deleteOne({
      name: req.query.name,
    });
    if (!user) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json({ message: "Place deleted successfully" });
  });
};

const getPlace = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Places");
  if (Object.keys(req.query).length === 0) {
    const result = await collection.find({}).toArray();
    return res.json(result);
  } else {
    if (!req.query.name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }
    const allowedFields = ["name"];
    validateFields("query", allowedFields)(req, res, async () => {
      const result = await collection.findOne({ name: req.query.name });

      if (!result) {
        return res
          .status(400)
          .json({ message: `Place with name ${req.query.name} not found` });
      }
      return res.json(result);
    });
  }
};

module.exports = { createPlace, updatePlace, removePlace, getPlace };
