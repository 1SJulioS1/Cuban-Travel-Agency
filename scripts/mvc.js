const fs = require("fs");
const path = require("path");

const mvc = () => {
  async function createDirectory(directoryPath) {
    try {
      await fs.promises.mkdir(directoryPath, { recursive: true });
      console.log(`${directoryPath} created`);
    } catch (error) {
      console.error(`Error creating ${directoryPath}: ${error.message}`);
    }
  }

  createDirectory("config");
  createDirectory("controllers");
  createDirectory("middleware");
  createDirectory("public");
  createDirectory("routes");
  createDirectory("views");

  [".env", ".gitignore", "server.js"].forEach((file) => {
    fs.writeFile(file, "", (err) => {
      if (err) {
        console.error(`Error creating ${file} file: ${err}`);
        return;
      }

      console.log(`${file} created successfully`);
    });
  });
};

module.exports = mvc;
