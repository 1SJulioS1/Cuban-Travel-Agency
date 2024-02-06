const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const initGit = () => {
  exec("git init", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      reject(error);
    } else {
      console.log("git initialized successfully");
    }
  });
};

const createGitignore = () => {
  const gitIgnoreContent = `node_modules/\n.env\nwhitelist.js`;

  fs.writeFile(
    path.join(__dirname, "../", ".gitignore"),
    gitIgnoreContent,
    (err) => {
      if (err) {
        console.error(`Error creating .gitignore file: ${err}`);
        return;
      }

      console.log(".gitignore created successfully");
    }
  );
};

module.exports = { initGit, createGitignore };
