import { Router } from "express";
import Log from "../../logging_middleware/logger.js";
import { getNotifications } from "../services/notificationService.js";

const router = Router();

const VALID_TYPES = ["Placement", "Result", "Event"];

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeFilterType(notificationType) {
  if (!notificationType) {
    return null;
  }

  const lowerCaseType = notificationType.toLowerCase();
  const matchedType = VALID_TYPES.find(
    (type) => type.toLowerCase() === lowerCaseType
  );

  return matchedType || null;
}

router.get("/", async (req, res, next) => {
  try {
    await Log("backend", "info", "route", "Notification API request received");

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);
    const notificationType = normalizeFilterType(req.query.notification_type);

    if (!Number.isInteger(page) || page < 1) {
      await Log("backend", "error", "route", "Invalid page query parameter");
      throw createError("page must be a positive integer");
    }

    if (!Number.isInteger(limit) || limit < 5) {
      await Log("backend", "error", "route", "Invalid limit query parameter");
      throw createError("limit must be a positive integer and at least 5");
    }

    if (req.query.notification_type && !notificationType) {
      await Log(
        "backend",
        "error",
        "route",
        "Invalid notification_type query parameter"
      );
      throw createError(
        "notification_type must be Placement, Result, or Event"
      );
    }

    await Log(
      "backend",
      "info",
      "route",
      `Filter applied: ${notificationType || "All"}`
    );
    await Log(
      "backend",
      "info",
      "route",
      `Pagination changed to page ${page} with limit ${limit}`
    );

    const result = await getNotifications({
      page,
      limit,
      notificationType,
    });

    if (result.data.length === 0) {
      await Log("backend", "warn", "route", "No notifications found");
    }

    res.json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.data,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
      filter: notificationType || "All",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
