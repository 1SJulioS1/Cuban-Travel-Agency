const validateFields = (source, allowedFields) => (req, res, next) => {
  if (source == "body" && Object.keys(req[source]).lenght === 0) {
    return res.sendStatus(400).json({ message: "No data submitted" });
  }
  const invalidFields = Object.keys(req[source]).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res
      .status(400)
      .json({ message: `Invalid fields: ${invalidFields.join(", ")}` });
  }

  next();
};

module.exports = validateFields;
