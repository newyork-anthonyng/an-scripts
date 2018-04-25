const fs = require("fs");
const readmeTemplate = require("../config/readmeTemplate");
const readPkgUp = require("read-pkg-up");
const printError = require("../utility").printError;

function populateReadmeTemplate (packageName) {
  return readmeTemplate.replace(/REPO_NAME/g, packageName);
};

function getPackageName () {
  return readPkgUp().then(result => {
    return result.pkg.name;
  });
}

getPackageName().then(packageName => {
  try {
    fs.writeFileSync("README.md", populateReadmeTemplate(packageName));

    console.log("Successfully created README.md");
  } catch (e) {
    printError("Something went wrong while writing README.md", e);
  }
})
.catch((e) => {
  printError("Could not find a package.json", e);
})