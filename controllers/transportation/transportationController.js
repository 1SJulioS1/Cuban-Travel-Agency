const { connectToDatabase } = require("../../config/dbConn.js");
const compareDate = require("../../utils/searchOptions");
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
      date: new Date(item.date).toISOString(),
    }));
    const result = await collection.insertOne(document);
  }
  res.status(201).json({
    message: "Transportation created successfully",
  });
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
  const transportation = await collection.findOne(req.params);
  if (!transportation) {
    return res.status(404).json({
      message: "Transportation not found",
    });
  }

  const spendingIndex = transportation.spending.findIndex(
    (s) =>
      s.name === req.body.name &&
      s.type === req.body.type &&
      parseInt(s.amount) === parseInt(req.body.amount) &&
      compareDate(
        new Date(s.date).toISOString(),
        new Date(req.body.date).toISOString()
      ) === 0
  );
  if (spendingIndex != -1) {
    return res
      .status(409)
      .json({ message: "Spending for this transportation already exist" });
  }
  const spending = {
    name: req.body.name,
    type: req.body.type,
    amount: parseInt(req.body.amount),
    date: new Date(req.body.date),
    email: decodedEmail,
  };
  const result = collection.updateOne(
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

const getTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  let query = {};
  if (req.query.name) query.name = req.query.name;
  if (req.query.type) query.type = req.query.type;
  if (req.query.phone) query.phone = req.query.phone;
  if (req.query.information) query.information = req.query.information;
  var result;
  Object.keys(query).length === 0
    ? (result = await collection.find({}, { _id: 0 }).toArray())
    : (result = await collection.findOne(query));

  res.json(result);
};
const updateTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.query?.name && !req.query?.type && !req.query?.phone) {
    return res.status(404).json({ message: "Update parameters are required" });
  }
  const transportation = await collection.findOne(req.query);
  if (!transportation) {
    return res
      .status(400)
      .json({ message: "Transportation service not found" });
  }
  const transportationData = req.body;
  if (Object.keys(req.body).length === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const updateFields = {};
  for (const key in transportationData) {
    if (transportationData[key] !== transportation[key]) {
      updateFields[key] = transportationData[key];
    }
  }
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Provide a different user data" });
  }

  const result = await collection.updateOne(req.query, { $set: updateFields });
  return res
    .status(200)
    .json({ message: "Transportation service updated successfully" });
};

const removeTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.query?.name && !req.query?.type && !req.query?.phone) {
    return res.status(404).json({ message: "Update parameters are required" });
  }

  const transportation = await collection.deleteOne(req.params);
  if (!transportation) {
    return res.status(404).json({ message: "Transportation not found" });
  }
  res.json({ message: "Transportation deleted successfully" });
};

const updateSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (
    !req.params?.name ||
    !req.params?.type ||
    !req.params?.phone ||
    !req.query?.spendingName ||
    !req.query?.spendingDate ||
    !req.body.amount ||
    !req.body.date
  ) {
    return res
      .status(400)
      .json({ message: "Spending name and date is required" });
  }
  const transportationData = req.body;
  if (Object.keys(transportationData).length === 0) {
    return res.status(400).json({ message: "No data submitted" });
  }

  const transportation = await collection.findOne({
    name: req.params.name,
    type: req.params.type,
    phone: req.params.phone,
  });
  if (!transportation) {
    return res
      .status(404)
      .json({ message: "No transportation for submitted data" });
  }
  const spendingIndex = transportation.spending.findIndex(
    (s) =>
      s.name === req.query.spendingName &&
      compareDate(
        new Date(s.date).toISOString(),
        new Date(req.query.spendingDate).toISOString()
      ) === 0
  );
  if (spendingIndex === -1) {
    return res
      .status(404)
      .json({ message: "No transportation spending for submitted data" });
  }
  const spendingItem = transportation.spending[spendingIndex];
  if (
    spendingItem.amount === req.body.amount &&
    compareDate(
      new Date(spendingItem.date).toISOString(),
      new Date(req.body.date).toISOString()
    ) === 0
  ) {
    return res.status(400).json({
      message: "The data in the request body matches the existing document.",
    });
  }
  console.log(transportation.spending[3]);
  const payloadBase64Url = req.cookies["jwt"].split(".")[1];
  const payloadJson = Buffer.from(payloadBase64Url, "base64").toString("utf8");
  const payload = JSON.parse(payloadJson);
  const decodedEmail = payload.email;
  const updateResult = await collection.updateOne(
    {
      name: req.params.name,
      type: req.params.type,
      phone: req.params.phone,
    },
    {
      $set: {
        [`spending.$[element].amount`]: parseInt(req.body.amount),
        [`spending.$[element].date`]: new Date(req.body.date),
        [`spending.$[element].email`]: decodedEmail,
      },
    },
    {
      arrayFilters: [
        {
          "element.name": req.query.spendingName,
          "element.date": {
            $eq: new Date(req.query.spendingDate),
          },
        },
      ],
    }
  );
  console.log(updateResult);
  if (!updateResult.modifiedCount) {
    return res.status(404).json({ message: "Update failed" });
  }

  res.json({ message: "Spending updated successfully" });
};

const removeSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  const { name, type, phone } = req.params;
  const { spendingName, spendingDate, spendingType, spendingAmount } =
    req.query;
  if (!name || !type || !phone) {
    return res
      .status(400)
      .json({ message: "All transportation details must be provided" });
  }
  if (!spendingName || !spendingDate || !spendingType || !spendingAmount) {
    return res
      .status(400)
      .json({ message: "All spending details must be provided" });
  }
  const updateResult = await collection.updateOne(
    { name, type, phone },
    {
      $pull: {
        spending: {
          name: spendingName,
          type: spendingType,
          amount: parseInt(spendingAmount),
          date: new Date(spendingDate),
        },
      },
    }
  );
  console.log(updateResult);
  if (updateResult.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: "No spending found with the provided details" });
  }
  res.json({ message: "Spending deleted successfully" });
};

module.exports = {
  createTransportation,
  getTransportation,
  updateTransportation,
  removeTransportation,
  addSpending,
  updateSpending,
  removeSpending,
};
