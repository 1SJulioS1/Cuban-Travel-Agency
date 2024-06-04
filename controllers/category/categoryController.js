const { connectToDatabase } = require("../../config/dbConn.js");

const createCategory = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Category");
  if (!req.body?.name || Object.keys(req.body).length !== 1) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const allowedFields = ["name"];
  validateFields("body", allowedFields)(req, res, async () => {
    const duplicate = await collection.findOne({
      name: req.body.name,
    });
    if (duplicate) {
      return res.status(401).json({ message: "Duplicated Category" });
    }
    const categoryData = req.body;
    categoryData.tours = [];
    const result = await collection.insertOne({
      name: req.body.name,
      tours: [],
    });
    return res.status(201).json({
      message: "Category created successfully",
    });
  });
};

const getCategory = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Category");
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
          .json({ message: `Category with name ${req.query.name} not found` });
      }
      return res.json(result);
    });
  }
};

const removeCategory = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Category");
  if (!req?.query?.name) {
    return res.status(400).json({ message: "Name parameter is required" });
  }
  const allowedFields = ["name"];
  validateFields("query", allowedFields)(req, res, async () => {
    const category = await collection.deleteOne({
      name: req.query.name,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  });
};
const updateCategory = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Category");
  if (!req.query?.name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const allowedFields = ["name"];
  validateFields("query", allowedFields)(req, res, async () => {
    var data = req.body;
    const allowedFields = ["name"];
    validateFields("body", allowedFields)(req, res, async () => {
      const category = await collection.findOne({ name: req.query.name });
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      if (category.name === req.body.name) {
        return res
          .status(400)
          .json({ message: "Provide a different category data" });
      }
      const result = await collection.updateOne(
        { name: req.query.name },
        {
          $set: { name: req.body.name },
        }
      );
      return res.status(200).json({ message: "Category updated successfully" });
    });
  });
};
module.exports = {
  createCategory,
  getCategory,
  removeCategory,
  updateCategory,
};
