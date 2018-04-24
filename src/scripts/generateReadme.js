const fs = require("fs");
const readmeTemplate = require("../config/readmeTemplate");
const readPkgUp = require("read-pkg-up");

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
  } catch (e) {
    console.error(e);
    console.error("Could not create README.md");
  }
})
.catch((e) => {
  console.error(e);
  console.error("Could not find a package.json to use for the package name.");
})