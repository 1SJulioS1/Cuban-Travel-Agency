const fs = require("fs").promises;
const path = require("path");

const addNodemon = async () => {
  const packageJsonPath = path.join(__dirname, "../", "package.json");

  let data;
  try {
    data = await fs.readFile(packageJsonPath, "utf8");
  } catch (err) {
    console.error(`Error: ${err}`);
    return;
  }

  const packageJson = JSON.parse(data);

  packageJson.scripts = {
    ...packageJson.scripts,
    dev: "nodemon server",
  };

  const updatedPackageJson = JSON.stringify(packageJson, null, 2);

  try {
    await fs.writeFile(packageJsonPath, updatedPackageJson, "utf8");
    console.log("npm run dev script added ");
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

module.exports = addNodemon;
