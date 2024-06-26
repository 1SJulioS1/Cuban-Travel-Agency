const { connectToDatabase } = require("../../config/dbConn.js");
const compareDate = require("../../utils/searchOptions");

const createTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.body.type || !req.body.name || !req.body.phone) {
    return res.status(400).json({
      message: "Type, name and phone  must be provided",
    });
  }
  const allowedFields = ["name", "type", "information", "phone", "spending"];
  validateFields("body", allowedFields)(req, res, async () => {
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
    document.tours = []; // Inicialmente vacío

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
    return res.status(201).json({
      message: "Transportation created successfully",
    });
  });
};

const addSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  const { name, type, phone } = req.params;
  if (!name || !type || !phone) {
    return res.status(400).json({
      message: "Name, type and phone and amount must be provided",
    });
  }
  const allowedFields = ["name", "photos"];
  validateFields("params", allowedFields)(req, res, async () => {
    if (
      !req.body.name ||
      !req.body.type ||
      !req.body.amount ||
      !req.body.date
    ) {
      return res.status(400).json({
        message: "Name, type, amount and date must be provided",
      });
    }
    const allowedFields = ["name", "type", "amount", "date"];
    validateFields("body", allowedFields)(req, res, async () => {
      const payloadBase64Url = req.cookies["jwt"].split(".")[1];
      const payloadJson = Buffer.from(payloadBase64Url, "base64").toString(
        "utf8"
      );
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
      if (Object.keys(result).length === 0) {
        return res
          .status(400)
          .json({ message: "Provide a different rent data" });
      }
      return res.status(201).json({
        message: "Transportation spending added successfully",
      });
    });
  });
};

const getTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (Object.keys(req.query).length === 0) {
    const result = await collection.find({}).toArray();
    return res.json(result);
  } else {
    if (!req.query.name || !req.query.type || !req.query.phone) {
      return res
        .status(400)
        .json({ message: "Type, name and phone  must be provided" });
    }
    const allowedFields = ["name", "type", "phone"];
    validateFields("query", allowedFields)(req, res, async () => {
      const result = await collection.findOne({
        name: req.query.name,
        type: req.query.type,
        phone: req.query.type,
      });
      if (!result) {
        return res.status(400).json({
          message: `Transportation with name ${req.query.name}, phone ${req.query.phone} and type ${req.query.type} not found`,
        });
      }
      return result.json(result);
    });
  }
};
const updateTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.query?.name && !req.query?.type && !req.query?.phone) {
    return res
      .status(400)
      .json({ message: "Transportation name, type and phone is required" });
  }
  const allowedFields = ["name", "type", "phone"];
  validateFields("query", allowedFields)(req, res, async () => {
    const transportation = await collection.findOne(req.query);
    if (!transportation) {
      return res
        .status(400)
        .json({ message: "Transportation service not found" });
    }
    const allowedFields = ["name", "type", "phone", "information", "spending"];
    validateFields("body", allowedFields)(req, res, async () => {
      const transportationData = req.body;

      const updateFields = {};
      for (const key in transportationData) {
        if (transportationData[key] !== transportation[key]) {
          updateFields[key] = transportationData[key];
        }
      }
      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json({ message: "Provide a different user data" });
      }
      const result = await collection.updateOne(req.query, {
        $set: updateFields,
      });
      if (result.modifiedCount === 0) {
        return res
          .status(500)
          .json({ message: "Failed to update transportation service." });
      }
      return res
        .status(200)
        .json({ message: "Transportation service updated successfully" });
    });
  });
};

const removeTransportation = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.query?.name && !req.query?.type && !req.query?.phone) {
    return res.status(404).json({
      message: "Transportation name, type and phone parameters are required",
    });
  }
  const allowedFields = ["name", "type", "phone"];
  validateFields("query", allowedFields)(req, res, async () => {
    const transportation = await collection.deleteOne(req.query);
    if (!transportation) {
      return res.status(404).json({ message: "Transportation not found" });
    }
    return res.json({ message: "Transportation deleted successfully" });
  });
};

const updateSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (
    !req.params?.name ||
    !req.params?.type ||
    !req.params?.phone ||
    !req.query?.spendingName ||
    !req.query?.spendingDate
  ) {
    return res
      .status(400)
      .json({ message: "Spending name and date is required" });
  }
  const allowedFields = ["name", "type", "phone"];
  validateFields("params", allowedFields)(req, res, async () => {
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
    const allowedFields = ["spendingName", "spendingDate"];
    validateFields("query", allowedFields)(req, res, async () => {
      const allowedFields = ["name", "date", "amount", "type"];
      validateFields("query", allowedFields)(req, res, async () => {
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
            message:
              "The data in the request body matches the existing document.",
          });
        }
        console.log(transportation.spending[3]);
        const payloadBase64Url = req.cookies["jwt"].split(".")[1];
        const payloadJson = Buffer.from(payloadBase64Url, "base64").toString(
          "utf8"
        );
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
        if (!updateResult.modifiedCount) {
          return res.status(404).json({ message: "Update failed" });
        }

        return res
          .status(200)
          .json({ message: "Spending updated successfully" });
      });
    });
  });
};

const removeSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  const { name, type, phone } = req.params;
  if (!name || !type || !phone) {
    return res
      .status(400)
      .json({ message: "Transportation name, type and phone are required" });
  }
  const allowedFields = ["name", "type", "phone"];
  validateFields("params", allowedFields)(req, res, async () => {
    const { spendingName, spendingDate, spendingType, spendingAmount } =
      req.query;

    if (!spendingName || !spendingDate || !spendingType || !spendingAmount) {
      return res
        .status(400)
        .json({ message: "All spending details must be provided" });
    }
    const allowedFields = ["name", "type", "phone"];
    validateFields("query", allowedFields)(req, res, async () => {
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
      if (updateResult.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "No spending found with the provided details" });
      }
      return res.status(200).json({ message: "Spending deleted successfully" });
    });
  });
};

const getSpending = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection("Transportation");
  if (!req.params.name || !req.params.type || !req.params.phone) {
    return res
      .status(400)
      .json({ message: "No transportation data submitted" });
  }
  const allowedFields = ["name", "type", "phone"];
  validateFields("params", allowedFields)(req, res, async () => {
    const transportation = await collection.findOne({
      name: req.params.name,
      type: req.params.type,
      phone: req.params.phone,
    });
    if (!transportation) {
      return res
        .status(400)
        .json({ message: "No transportation with submitted data" });
    }
    const allowedFields = [
      "spendingName",
      "spendingType",
      "spendingAmount",
      "spendingDate",
      "spendingEditor",
      "dateOperator",
      "amountOperator",
    ];
    validateFields("query", allowedFields)(req, res, async () => {
      if (Object.keys(req.query).length === 0) {
        return res.json(transportation.spending);
      }
      let query = {};
      if (req.query.spendingName) query.name = req.query.spendingName;
      if (req.query.spendingType) query.type = req.query.spendingType;
      if (req.query.spendingAmount)
        query.amount = parseInt(req.query.spendingAmount);
      if (req.query.spendingDate) query.date = new Date(req.query.spendingDate);
      if (req.query.spendingEditor) query.editor = req.query.spendingEditor;
      if (req.query.dateOperator) query.dateOperator = req.query.dateOperator;
      if (req.query.amountOperator)
        query.amountOperator = req.query.amountOperator;

      let filteredSpendings = transportation.spending;
      if (query.name) {
        filteredSpendings = filteredSpendings.filter(
          (spending) => spending.name === query.name
        );
      }
      if (query.type) {
        filteredSpendings = filteredSpendings.filter(
          (spending) => spending.type === query.type
        );
      }
      if (query.amount) {
        filteredSpendings = filteredSpendings.filter((spending) => {
          switch (query.amountOperator) {
            case "lt":
              return spending.amount < query.amount;
            case "lte":
              return spending.amount <= query.amount;
            case "gt":
              return spending.amount > query.amount;
            case "gte":
              return spending.amount >= query.amount;
            case "eq":
              return spending.amount === query.amount;
            default:
              return spending.amount === query.amount;
          }
        });
      }
      if (query.date) {
        filteredSpendings = filteredSpendings.filter((spending) => {
          const spendingDate = new Date(spending.date).getTime();

          switch (query.dateOperator) {
            case "lt":
              return spendingDate < query.date.getTime;
            case "lte":
              return spendingDate <= query.date.getTime();
            case "gt":
              return spendingDate > query.date.getTime();
            case "gte":
              return spendingDate >= query.date.getTime();
            case "eq":
              return spendingDate === query.date.getTime();
            default:
              return spendingDate === query.date.getTime();
          }
        });
      }
      if (query.editor) {
        filteredSpendings = filteredSpendings.filter(
          (spending) => spending.editor === query.editor
        );
      }
      return res.json(filteredSpendings);
    });
  });
};
module.exports = {
  createTransportation,
  getTransportation,
  updateTransportation,
  removeTransportation,
  addSpending,
  updateSpending,
  removeSpending,
  getSpending,
};
