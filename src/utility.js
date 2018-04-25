/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const which = require("which");

function printError(message, e) {
  console.error(message);
  console.error(e);
}

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === "string" ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, ".");
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

module.exports = {
  printError,
  resolveBin
};
