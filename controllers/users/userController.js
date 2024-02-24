const { connectToDatabase } = require("../../config/dbConn.js");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("User");
  const { username, password, email, role } = req.body;
  if (!username || !password || !email || !role) {
    return res.status(400).json({
      message: "Username, password, email, and role must be provided",
    });
  }
  const duplicate = await collection.findOne({ email });
  if (duplicate) {
    return res.status(401).json({ message: "Duplicated user" });
  }
  const hashedPwd = await bcrypt.hash(password, 10);

  const result = await db.collection("User").insertOne({
    username,
    role: [role],
    password: hashedPwd,
    email,
  });
  return res.status(201).json({ message: "User created successfully" });
};
const getUser = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("User");

  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }
  const user = await collection
    .find(
      { _id: new ObjectId(req.params.id) },
      { projection: { _id: 0, username: 1, email: 1 } }
    )
    .toArray();
  if (!user) {
    return res
      .status(400)
      .json({ message: `User with ID ${req.params.id} not found` });
  }
  res.json(user);
};

const updateUser = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("User");

  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const userData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const user = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const updateFields = {};
  for (const key in userData) {
    console.log(userData[key], user[key]);
    if (userData[key] !== user[key]) {
      updateFields[key] = userData[key];
    }
  }
  console.log(updateFields);
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Provide a different user data" });
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: updateFields,
    }
  );

  if (result.matchedCount > 0 && result.modifiedCount === 0) {
    return res.status(400).json({ message: "Provide a different user data" });
  }
  if (result.modifiedCount > 0) {
    return res.status(200).json({ message: "User updated successfully" });
  }
};
module.exports = { createUser, getUser, updateUser };
