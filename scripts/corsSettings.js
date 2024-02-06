const fs = require("fs").promises;
const path = require("path");

const writeToFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    console.log(`${filePath} created successfully`);
  } catch (err) {
    console.error(`Error creating ${filePath} file: ${err}`);
  }
};

const whitelist = `const whiteList = [
  "https://www.yoursite.com",
  "https://127.0.0.1:5500",
  "http://localhost:3500",
];
module.exports = whiteList;`;

const accessControlHeader = `
const whiteList = require("../config/whitelist");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
module.exports = credentials;
`;

const corsOptions = `
  const whiteList = require("./whitelist");
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
  `;

const corsSetting = async () => {
  await writeToFile(
    path.join(__dirname, "../config", "whitelist.js"),
    whitelist
  );
  await writeToFile(
    path.join(__dirname, "../middleware", "credentials.js"),
    accessControlHeader
  );
  await writeToFile(
    path.join(__dirname, "../config", "corsOptions.js"),
    corsOptions
  );
};
module.exports = corsSetting;
