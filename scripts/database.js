const fs = require("fs");
const path = require("path");

const databaseConnection = () => {
  const content = `const { MongoClient } = require("mongodb");
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
`;

  fs.writeFile(
    path.join(__dirname, "../config", "dbConn.js"),
    content,
    (err) => {
      if (err) {
        console.error(`Error creating database file: ${err}`);
        return;
      }

      console.log(`Database connection script created successfully`);
    }
  );
};

module.exports = databaseConnection;
