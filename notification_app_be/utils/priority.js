const TYPE_SCORES = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function toTitleCase(value = "Event") {
  const lowerCaseValue = String(value).toLowerCase();

  return lowerCaseValue.charAt(0).toUpperCase() + lowerCaseValue.slice(1);
}

export function normalizeNotification(notification, index) {
  const type = toTitleCase(notification.Type || notification.type);
  const message = notification.Message || notification.message || "";
  const createdAt =
    notification.Timestamp ||
    notification.createdAt ||
    notification.created_at ||
    new Date().toISOString();
  const isRead =
    notification.isRead ?? notification.is_read ?? notification.IsRead ?? false;

  return {
    id: notification.ID || notification.id || `notification-${index + 1}`,
    title:
      notification.title ||
      `${type} Notification`,
    message,
    type: TYPE_SCORES[type] ? type : "Event",
    isRead: Boolean(isRead),
    createdAt,
  };
}

export function getPriority(notification) {
  let score = TYPE_SCORES[notification.type] || 1;

  if (!notification.isRead) {
    score += 2;
  }

  return score;
}

export function sortNotificationsByPriority(notifications) {
  return [...notifications].sort((first, second) => {
    const scoreDifference = getPriority(second) - getPriority(first);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return new Date(second.createdAt) - new Date(first.createdAt);
  });
}
