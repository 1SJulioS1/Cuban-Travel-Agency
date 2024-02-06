const express = require("express");
const app = express();
const cors = require("cors");
const credentials = require("./middleware/credentials");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn.js").connectToDatabase;

connectDB();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/group", require("./routes/initialAdmin"));

app.use(errorHandler);

PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
