const fs = require("fs");
const licenseTemplate = require("../config/licenseTemplate");
const readPkgUp = require("read-pkg-up");
const writePkg = require("write-pkg");
const printError = require("../utility").printError;

function getCurrentYear() {
  return new Date().getFullYear();
}

function populateReadmeTemplate() {
  return licenseTemplate
    .replace("<YEAR>", getCurrentYear())
    .replace("<NAME>", "Anthony Ng").trim();
}

try {
  fs.writeFileSync("LICENSE", populateReadmeTemplate());

  readPkgUp().then(result => {
    const newPackageInfo = Object.assign({}, result.pkg, { license: "MIT" });

    writePkg(newPackageInfo).then(() => {
      console.log("Successfully created LICENSE");
    });
  });  
} catch (e) {
  printError("Something went wrong while writing LICENSE", e);
}
