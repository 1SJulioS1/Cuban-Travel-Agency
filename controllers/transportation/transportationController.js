const { connectToDatabase } = require("../../config/dbConn.js");
const { ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");

const createTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  const { type, name, phone, spending } = req.body;
  if (!type || !name || !phone) {
    return res.status(400).json({
      message: "Type, name, phone and email must be provided",
    });
  }
  const duplicate = await collection.findOne({ name, type, phone });
  if (duplicate) {
    return res
      .status(401)
      .json({ message: "Duplicated transportation service" });
  }
  const document = {
    name: req.body.name,
    type: req.body.type,
    phone: req.body.phone,
  };

  if (req.body.information) document.information = req.body.information;
  if (req.body.spending) {
    const payloadBase64Url = req.cookies["jwt"].split(".")[1];
    const payloadJson = Buffer.from(payloadBase64Url, "base64").toString(
      "utf8"
    );
    const payload = JSON.parse(payloadJson);
    const decodedEmail = payload.email;
    document.spending = spending.map((item) => ({
      ...item,
      editor: decodedEmail,
      date: new Date(item.date),
    }));
    const result = await collection.insertOne(document);
    res.status(201).json({
      message: "Transportation created successfully",
    });
  }
};

const addSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  const { name, type, phone } = req.params;
  if (!name || !type || !phone) {
    return res.status(400).json({
      message: "Name, type, date and amount must be provided",
    });
  }
  if (!req.body.name || !req.body.type || !req.body.amount || !req.body.date) {
    return res.status(400).json({
      message: "Name, type, amount and date must be provided",
    });
  }
  const payloadBase64Url = req.cookies["jwt"].split(".")[1];
  const payloadJson = Buffer.from(payloadBase64Url, "base64").toString("utf8");
  const payload = JSON.parse(payloadJson);
  const decodedEmail = payload.email;

  const spending = {
    name: req.body.name,
    type: req.body.type,
    amount: req.body.amount,
    date: new Date(req.body.date),
    email: decodedEmail,
  };

  const result = await db.collection("Transportation").updateOne(
    { name, type, phone },
    {
      $push: {
        spending,
      },
    }
  );
  res.status(201).json({
    message: "Transportation spending added successfully",
  });
};

module.exports = { createTransportation, addSpending };
