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
  const itemsArray = photos.trim().split(",");

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
  var data = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const place = await collection.findOne({ name: req.params.name });

  if (!place) {
    return res.status(400).json({ message: "Place not found" });
  }

  if (data.photos) {
    data.photos = data.photos.split(",").map((photo) => photo.trim());
  }

  const isSamePhotos =
    JSON.stringify(place.photos) === JSON.stringify(data.photos);

  // Si las fotos son las mismas, verificar si hay otros cambios
  if (isSamePhotos) {
    // Aquí puedes agregar lógica para verificar otros campos si es necesario
    return res.status(200).json({ message: "No changes detected" });
  }

  const result = await collection.updateOne(
    { name: req.params.name },
    {
      $set: data,
    }
  );

  return res.status(200).json({ message: "Place updated successfully" });
};

module.exports = { createPlace, updatePlace };
