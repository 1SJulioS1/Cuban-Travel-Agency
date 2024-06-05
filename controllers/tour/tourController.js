const { connectToDatabase } = require("../../config/dbConn.js");
const updateRelatedCollections = require("./auxiliar_functions.js");
const validateFields = require("../../middleware/verifyFields.js");
const { ObjectId } = require("mongodb");

const createTour = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Tour");
  const {
    title,
    duration,
    price,
    photos,
    allowedPeople,
    startDate,
    endDate,
    categories,
    description,
    interpreters,
    guides,
    places,
    transports,
    rents,
  } = req.body;

  if (
    !title ||
    !duration ||
    !price ||
    !allowedPeople ||
    !startDate ||
    !endDate ||
    !categories ||
    !description ||
    !places
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const allowedFields = [
    "title",
    "duration",
    "price",
    "photos",
    "allowedPeople",
    "startDate",
    "endDate",
    "categories",
    "description",
    "interpreters",
    "guides",
    "places",
    "transports",
    "rents",
  ];
  validateFields("body", allowedFields)(req, res, async () => {
    const duplicate = await collection.findOne({
      title,
      duration: parseInt(duration),
      price: parseInt(price),
      allowedPeople: parseInt(allowedPeople),
      categories: { $all: categories.map((id) => new ObjectId(id)) },
      places: { $all: places.map((id) => new ObjectId(id)) },
    });

    if (duplicate) {
      return res.status(409).json({ error: "Duplicate tour found" });
    }
    const tour = {
      title,
      duration: parseInt(duration),
      price: parseInt(price),
      photos: photos ? photos : [],
      allowedPeople: parseInt(allowedPeople),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      categories: categories.map((id) => new ObjectId(id)),
      description,
      interpreters: interpreters
        ? interpreters.map((id) => new ObjectId(id))
        : [],
      guides: guides ? guides.map((id) => new ObjectId(id)) : [],
      places: places.map((id) => new ObjectId(id)),
      transports: transports ? transports.map((id) => new ObjectId(id)) : [],
      rents: rents ? rents.map((id) => new ObjectId(id)) : [],
      users: [],
    };

    const result = await collection.insertOne(tour);
    const tourId = result.insertedId;
    await updateRelatedCollections("Category", categories, tourId);
    await updateRelatedCollections("Places", places, tourId);

    if (interpreters) {
      await updateRelatedCollections("Interpreter", interpreters, tourId);
    }
    if (guides) {
      await updateRelatedCollections("Guide", guides, tourId);
    }
    if (transports) {
      await updateRelatedCollections("Transportation", transports, tourId);
    }
    if (rents) {
      await updateRelatedCollections("Rent", rents, tourId);
    }

    return res.status(201).json("Tour created successfully!");
  });
};

const getTour = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Tour");
  if (
    !req.query.title ||
    !req.query.duration ||
    !req.query.price ||
    !req.query.allowedPeople ||
    !req.query.categories ||
    !req.query.places
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const allowedFields = [
    "title",
    "duration",
    "price",
    "allowedPeople",
    "categories",
    "places",
  ];
  validateFields("query", allowedFields)(req, res, async () => {
    const categoriesArray = req.query.categories
      .split(",")
      .map((id) => new ObjectId(id));
    const placesArray = req.query.places
      .split(",")
      .map((id) => new ObjectId(id));
    const result = await collection.findOne({
      title: req.query.title,
      duration: parseInt(req.query.duration),
      price: parseInt(req.query.price),
      allowedPeople: parseInt(req.query.allowedPeople),
      categories: { $all: categoriesArray },
      places: { $all: placesArray },
    });
    if (!result) {
      return res.status(404).json({
        message: `Tour with title ${req.query.title}, duration of ${req.query.duration}, price of ${req.query.price} and ${req.query.allowedPeople} people max not found`,
      });
    }
    return res.json(result);
  });
};
const removeTour = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Tour");
  if (
    !req.query.title ||
    !req.query.duration ||
    !req.query.price ||
    !req.query.allowedPeople ||
    !req.query.categories ||
    !req.query.places
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const allowedFields = [
    "title",
    "duration",
    "price",
    "allowedPeople",
    "categories",
    "places",
  ];
  validateFields("query", allowedFields)(req, res, async () => {
    if (
      !req.query.title ||
      !req.query.duration ||
      !req.query.price ||
      !req.query.allowedPeople ||
      !req.query.categories ||
      !req.query.places
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const allowedFields = [
      "title",
      "duration",
      "price",
      "allowedPeople",
      "categories",
      "places",
    ];
    validateFields("query", allowedFields)(req, res, async () => {
      const categoriesArray = req.query.categories
        .split(",")
        .map((id) => new ObjectId(id));
      const placesArray = req.query.places
        .split(",")
        .map((id) => new ObjectId(id));
      const result = await collection.deleteOne({
        title: req.query.title,
        duration: parseInt(req.query.duration),
        price: parseInt(req.query.price),
        allowedPeople: parseInt(req.query.allowedPeople),
        categories: { $all: categoriesArray },
        places: { $all: placesArray },
      });
      if (!result) {
        return res.status(400).json({
          message: `Tour with title ${req.query.title}, duration of ${req.query.duration}, price of ${req.query.price} and ${req.query.allowedPeople} people max not found`,
        });
      }
      res.json({ message: "Place deleted successfully" });
    });
  });
};
const updateTour = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Tour");
  if (
    !req.query.title ||
    !req.query.duration ||
    !req.query.price ||
    !req.query.allowedPeople ||
    !req.query.categories ||
    !req.query.places
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const allowedFields = [
    "title",
    "duration",
    "price",
    "allowedPeople",
    "categories",
    "places",
  ];
  validateFields("query", allowedFields)(req, res, async () => {
    const categoriesArray = req.query.categories
      .split(",")
      .map((id) => new ObjectId(id));
    const placesArray = req.query.places
      .split(",")
      .map((id) => new ObjectId(id));
    const tour = await collection.findOne({
      title: req.query.title,
      duration: parseInt(req.query.duration),
      price: parseInt(req.query.price),
      allowedPeople: parseInt(req.query.allowedPeople),
      categories: { $all: categoriesArray },
      places: { $all: placesArray },
    });
    if (!tour) {
      return res.status(400).json({
        message: `Tour with title ${req.query.title}, duration of ${req.query.duration}, price of ${req.query.price} and ${req.query.allowedPeople} people max not found`,
      });
    }
    const allowedFields = [
      "title",
      "duration",
      "price",
      "photos",
      "allowedPeople",
      "startDate",
      "endDate",
      "categories",
      "description",
      "interpreters",
      "guides",
      "places",
      "transports",
      "rents",
    ];
    validateFields("body", allowedFields)(req, res, async () => {
      const tourData = req.body;
      const updateFields = {};
      for (const key in tourData) {
        if (tourData[key] !== tour[key]) {
          if (
            (key === "categories" || key === "places") &&
            typeof tourData[key] === "string"
          ) {
            updateFields[key] = tourData[key]
              .split(",")
              .map((id) => new ObjectId(id));
          } else if (
            key === "duration" ||
            key === "price" ||
            key === "allowedPeople"
          ) {
            updateFields[key] = parseInt(tourData[key]);
          } else if (key === "startDate" || key === "endDate") {
            updateFields[key] = new Date(tourData[key]);
          } else {
            updateFields[key] = tourData[key];
          }
        }
      }

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "Provide a different interpreter data" });
      }
      const result = await collection.updateOne(
        { _id: tour._id },
        {
          $set: updateFields,
        }
      );
      return res.status(200).json({ message: "Tour updated successfully" });
    });
  });
};
module.exports = {
  createTour,
  getTour,
  removeTour,
  updateTour,
};
