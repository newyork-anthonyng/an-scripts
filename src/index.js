#! /usr/bin/env node
/* eslint-disable no-console */
const path = require("path");
const spawn = require("cross-spawn");
const glob = require("glob");

const [executor, ignoredBin, script, ...args] = process.argv;

function attemptResolve(...resolveArgs) {
  try {
    return require.resolve(...resolveArgs);
  } catch (e) {
    console.error(e);
    return null;
  }
}

function handleSignal(result) {
  if (result.signal === "SIGKILL") {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        "This probably means the system ran out of memory or someone called " +
        "`kill -9` on the process."
    );
  } else if (result.signal === "SIGTERM") {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        "Someone might have called `kill` or `killall`, or the system could " +
        "be shutting down."
    );
  }

  process.exit(1);
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/kcd-scripts/issues/4
  return Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key]; // eslint-disable-line no-param-reassign
        return envCopy;
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true
      }
    );
}

function spawnScript() {
  const relativeScriptPath = path.join(__dirname, "scripts", script);
  const scriptPath = attemptResolve(relativeScriptPath);

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`);
  }
  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: "inherit",
    env: getEnv()
  });

  if (result.signal) {
    handleSignal(result);
  } else {
    process.exit(result.status);
  }
}

function printAvailableScripts() {
  const scriptsAvailable = glob.sync(path.join(__dirname, "scripts", "*"));

  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map(s =>
      s
        .replace(path.join(__dirname, "scripts/"), "")
        .replace(/__tests__/, "")
        .replace(/\.js$/, "")
    )
    .filter(Boolean)
    .join("\n")
    .trim();

  const fullMessage = `
Usage: ${ignoredBin} [script] [--flags]

Available Scripts:
${scriptsAvailableMessage}
  `.trim();

  console.log(`\n${fullMessage}\n`);
}

if (script) {
  spawnScript();
} else {
  printAvailableScripts();
}
