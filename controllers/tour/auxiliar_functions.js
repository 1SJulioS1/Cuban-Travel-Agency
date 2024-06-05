const { connectToDatabase } = require("../../config/dbConn.js");
const { ObjectId } = require("mongodb");

const updateRelatedCollections = async (collectionName, ids, tourId) => {
  const db = await connectToDatabase();

  await db
    .collection(collectionName)
    .updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      { $addToSet: { tours: tourId } }
    );
};

module.exports = updateRelatedCollections;
