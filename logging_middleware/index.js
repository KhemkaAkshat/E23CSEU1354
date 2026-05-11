const Log = require("./logger");

async function testLog() {
  await Log(
    "backend",
    "error",
    "handler",
    "received string, expected bool"
  );
}

testLog();