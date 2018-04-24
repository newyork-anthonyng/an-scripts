// https://www.npmjs.com/package/commitizen#commitizen-for-multi-repo-projects
const path = require("path");
const bootstrap = require("commitizen/dist/cli/git-cz").bootstrap;

bootstrap({
    cliPath: path.join(__dirname, "../../node_modules/commitizen"),
    config: {
        "path": "cz-conventional-changelog"
    }
})