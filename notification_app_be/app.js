import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import notificationRoutes from "./routes/notificationRoutes.js";
import Log from "../logging_middleware/logger.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Backend health route accessed");

  res.json({
    success: true,
    message: "Notification backend running",
  });
});

app.use("/notifications", notificationRoutes);

app.use(async (error, req, res, next) => {
  await Log(
    "backend",
    "error",
    "middleware",
    `Backend error: ${error.message}`
  );

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Something went wrong on the backend",
  });
});

app.listen(PORT, async () => {
  await Log(
    "backend",
    "info",
    "config",
    `Notification backend running on port ${PORT}`
  );
});
