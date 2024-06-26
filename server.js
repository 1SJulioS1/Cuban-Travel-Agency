const express = require("express");
const app = express();
const cors = require("cors");
const credentials = require("./middleware/credentials");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn.js").connectToDatabase;
const bodyParser = require("body-parser");
const verifyJWT = require("./middleware/verifyJWT");

connectDB();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/group", require("./routes/initialAdmin"));
app.use("/auth", require("./routes/authorization/auth"));
app.use("/refresh", require("./routes/authorization/refresh"));
app.use("/logout", require("./routes/authorization/logout"));
app.use("/user", require("./routes/user/reader"));
app.use("/rent", require("./routes/rent/rent"));
app.use("/interpreter", require("./routes/interpreter/interpreter"));
app.use("/guide", require("./routes/guide/guide"));
app.use("/tour", require("./routes/tour/tour"));
app.use("/category", require("./routes/category/category"));
app.use("/place", require("./routes/places/places"));

app.use(verifyJWT);
app.use("/admin", require("./routes/user/admin"));
app.use("/editor", require("./routes/user/editor"));
app.use("/reader", require("./routes/user/reader"));
app.use("/transportation", require("./routes/transportation/transportation"));

app.use(errorHandler);

PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
