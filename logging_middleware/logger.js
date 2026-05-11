import { LEVELS, PACKAGES, STACKS } from "./constant.js";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTM1NEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NzcwMSwiaWF0IjoxNzc4NDg2ODAxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDBmYmJjNTAtZGY2Ny00NTZjLWI4OGQtZGJjZGM5ZDE4ZGVhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWtzaGF0IGtoZW1rYSIsInN1YiI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiJ9LCJlbWFpbCI6ImUyM2NzZXUxMzU0QGJlbm5ldHQuZWR1LmluIiwibmFtZSI6ImFrc2hhdCBraGVta2EiLCJyb2xsTm8iOiJlMjNjc2V1MTM1NCIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiIsImNsaWVudFNlY3JldCI6InhkU0J2Q1JRVHZEYXpXbncifQ.TNiTsksi0UMKruG0znoSBGmpxl6-kT-9JMzTDBfU-vQ";

export default async function Log(stack, level, packageName, message) {
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

    const response = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
