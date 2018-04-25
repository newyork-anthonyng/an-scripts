const spawn = require("cross-spawn");
const { resolveBin } = require("../utility");
const path = require("path");

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

const config = ["--eslint-config-path", hereRelative("../config/eslintrc.js")];
const filesToApply = ["src/**/*.js", "lib/**/*.js"];
const writeFlag = ["--write"];

const result = spawn.sync(
  resolveBin("prettier-eslint-cli", {
    executable: "prettier-eslint"
  }),
  [...config, ...writeFlag, ...filesToApply],
  { stdio: "inherit" }
);

process.exit(result.status);
