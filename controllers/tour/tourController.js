const { connectToDatabase } = require("../../config/dbConn.js");
const updateRelatedCollections = require("./auxiliar_functions.js");
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
    users,
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
    !price ||
    !places
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const duplicate = await collection.findOne({
    title,
    duration,
    price,
    allowedPeople: parseInt(allowedPeople),
    categories: { $all: categories.map((id) => new ObjectId(id)) },
    places: { $all: places.map((id) => new ObjectId(id)) },
  });

  if (duplicate) {
    return res.status(409).json({ error: "Duplicate tour found" });
  }

  const tour = {
    title,
    duration,
    price,
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

  res.status(201).json("Tour created successfully!");
};

const getTour = async (req, res) => {};
const removeTour = async (req, res) => {};
const updateTour = async (req, res) => {};
module.exports = {
  createTour,
  getTour,
  removeTour,
  updateTour,
};
