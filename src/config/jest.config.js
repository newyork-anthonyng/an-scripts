module.exports = {
    testRegex: "/(lib|src)/.*spec\\.js$",
    collectCoverageFrom: ["(lib|src)/**/*.js"],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    }
  };