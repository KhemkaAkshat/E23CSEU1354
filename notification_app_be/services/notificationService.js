import axios from "axios";
import Log from "../../logging_middleware/logger.js";
import {
  getPriority,
  normalizeNotification,
  sortNotificationsByPriority,
} from "../utils/priority.js";

const NOTIFICATION_API =
  "http://4.224.186.213/evaluation-service/notifications";
const UPSTREAM_PAGE_SIZE = 10;
const MAX_UPSTREAM_PAGES = 20;

const EVALUATION_API_TOKEN =
  process.env.EVALUATION_API_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTM1NEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NzcwMSwiaWF0IjoxNzc4NDg2ODAxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDBmYmJjNTAtZGY2Ny00NTZjLWI4OGQtZGJjZGM5ZDE4ZGVhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWtzaGF0IGtoZW1rYSIsInN1YiI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiJ9LCJlbWFpbCI6ImUyM2NzZXUxMzU0QGJlbm5ldHQuZWR1LmluIiwibmFtZSI6ImFrc2hhdCBraGVta2EiLCJyb2xsTm8iOiJlMjNjc2V1MTM1NCIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6ImE4MDlkMzEyLTVkOTAtNGY0My1iNjA0LTlkNTdjMzY0YjY4NiIsImNsaWVudFNlY3JldCI6InhkU0J2Q1JRVHZEYXpXbncifQ.TNiTsksi0UMKruG0znoSBGmpxl6-kT-9JMzTDBfU-vQ";

function extractNotifications(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.notifications)) {
    return payload.notifications;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

async function fetchAllNotifications(notificationType) {
  const collectedNotifications = [];

  for (let currentPage = 1; currentPage <= MAX_UPSTREAM_PAGES; currentPage += 1) {
    const response = await axios.get(NOTIFICATION_API, {
      params: {
        page: currentPage,
        limit: UPSTREAM_PAGE_SIZE,
        ...(notificationType ? { notification_type: notificationType } : {}),
      },
      headers: {
        Authorization: `Bearer ${EVALUATION_API_TOKEN}`,
      },
    });

    const pageNotifications = extractNotifications(response.data);

    collectedNotifications.push(...pageNotifications);

    if (pageNotifications.length < UPSTREAM_PAGE_SIZE) {
      break;
    }
  }

  return collectedNotifications;
}

export async function getNotifications({ page, limit, notificationType }) {
  try {
    const rawNotifications = await fetchAllNotifications(notificationType);

    await Log(
      "backend",
      "info",
      "service",
      "Notifications fetched successfully from evaluation service"
    );

    const filteredNotifications = rawNotifications.map(normalizeNotification);

    const sortedNotifications = sortNotificationsByPriority(
      filteredNotifications
    ).map((notification) => ({
      ...notification,
      priorityScore: getPriority(notification),
    }));

    const startIndex = (page - 1) * limit;
    const paginatedNotifications = sortedNotifications.slice(
      startIndex,
      startIndex + limit
    );

    return {
      data: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: sortedNotifications.length,
        totalPages: Math.max(1, Math.ceil(sortedNotifications.length / limit)),
      },
      unreadCount: sortedNotifications.filter((notification) => !notification.isRead)
        .length,
    };
  } catch (error) {
    await Log(
      "backend",
      "error",
      "api",
      `API failure while fetching notifications: ${error.message}`
    );

    const serviceError = new Error(
      error.response?.data?.message ||
        "Failed to fetch notifications from evaluation service"
    );
    serviceError.status = error.response?.status || 500;
    throw serviceError;
  }
}
