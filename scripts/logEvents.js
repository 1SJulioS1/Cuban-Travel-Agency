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

const logEventCode = `const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message, logName) => {
 const dateTime = \`\${format(new Date(), "yyyMMdd\\tHH:mm:ss")}\`;
 const logItem = \`\${dateTime}\\t\${uuid()}\\t\${message}\\n\`;
 console.log(logItem);
 try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
 } catch (err) {
    console.log(err);
 }
};

module.exports = logEvents ;
`;

const errorHandlerCode = `const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(\`$\{err.name}: $\{err.message}\`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
`;

const logEvents = async () => {
  await writeToFile(
    path.join(__dirname, "../middleware", "logEvents.js"),
    logEventCode
  );
  await writeToFile(
    path.join(__dirname, "../middleware", "errorHandler.js"),
    errorHandlerCode
  );
};
module.exports = logEvents;
