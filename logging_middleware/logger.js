const axios = require("axios");

const {
  STACKS,
  LEVELS,
  PACKAGES,
} = require("./constant");

const LOG_API =
  "http://4.224.186.213/evaluation-service/logs";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTM1NEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4MDg1MCwiaWF0IjoxNzc4NDc5OTUwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjU2YmI0ZDQtZDI0OC00MDJiLWFhZGMtMmJiZjk2ZThmMWVhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWtzaGF0IGtoZW1rYSIsInN1YiI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiJ9LCJlbWFpbCI6ImUyM2NzZXUxMzU0QGJlbm5ldHQuZWR1LmluIiwibmFtZSI6ImFrc2hhdCBraGVta2EiLCJyb2xsTm8iOiJlMjNjc2V1MTM1NCIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiIsImNsaWVudFNlY3JldCI6InhkU0J2Q1JRVHZEYXpXbncifQ.5o6f2Q8if5lCS689ZHogLxRyjbP-4FwjYaiGc7U9as0";

async function Log(
  stack,
  level,
  packageName,
  message
) {
  try {
    if (!STACKS.includes(stack)) {
      throw new Error("Invalid stack");
    }

    if (!LEVELS.includes(level)) {
      throw new Error("Invalid level");
    }

    if (!PACKAGES.includes(packageName)) {
      throw new Error("Invalid package");
    }

    const body = {
      stack,
      level,
      package: packageName,
      message,
    };

    const response = await axios.post(
      LOG_API,
      body,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    console.log("SUCCESS:");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Logging failed:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;