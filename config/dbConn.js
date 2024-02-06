const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionString = process.env.DATABASE_URI || "";

let _db;

const client = new MongoClient(connectionString);

const connectToDatabase = async () => {
  if (_db) {
    return _db;
  }

  try {
    await client.connect();
    _db = client.db("Blog");
    console.log("MongoDB connection established");
  } catch (e) {
    console.error(e);
    throw e;
  }

  return _db;
};

module.exports = { connectToDatabase };
