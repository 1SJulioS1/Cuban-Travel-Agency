const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const addNodemon = require("./scripts/usingNodemon");
const { initGit, createGitignore } = require("./scripts/addGit");
const mvc = require("./scripts/mvc");
const databaseConnection = require("./scripts/database");
const logEvents = require("./scripts/logEvents");
const corsSetting = require("./scripts/corsSettings");

const createProject = () => {
  return new Promise((resolve, reject) => {
    exec("npm init -y", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
      } else {
        console.log("npm project created successfully");
        resolve();
      }
    });
  });
};

/* const installDependencies = () => {
  return new Promise((resolve, reject) => {
    exec(
      "npm i express cors dotenv mongodb nodemon jsonwebtoken cookie-parser bcrypt date-fns uuid",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          reject(error);
        } else {
          console.log("Dependencies installed successfully");
          resolve();
        }
      }
    );
  });
}; */

const serverCode = () => {
  const content = `const express = require("express");
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

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;

  fs.writeFile(path.join(__dirname, "server.js"), content, (err) => {
    if (err) {
      console.error(`Error creating ${file} file: ${err}`);
      return;
    }

    console.log(`server.js code created successfully`);
  });
};

const initialCommit = () => {
  return new Promise((resolve, reject) => {
    exec(
      'git add . && git commit -m " initial commit "',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          reject(error);
        } else {
          console.log("Initial commit done successfully");
          resolve();
        }
      }
    );
  });
};
createProject()
  .then(initGit)
  /* .then(installDependencies) */
  .then(addNodemon)
  .then(mvc)
  .then(createGitignore)
  .then(logEvents)
  .then(serverCode)
  .then(databaseConnection)
  .then(corsSetting)
  .then(initialCommit)
  .then(corsSetting)
  .catch((error) => {
    console.error(`Error: ${error}`);
  });
