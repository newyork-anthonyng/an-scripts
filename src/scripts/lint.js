const spawn = require("cross-spawn");
const { resolveBin } = require("../utility");
const path = require("path");

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

const config = ["--config", hereRelative("../config/eslintrc.js")];
const filesToApply = ["."];

const result = spawn.sync(resolveBin("eslint"), [...config, ...filesToApply], {
  stdio: "inherit"
});

process.exit(result.status);
