# Stage 1

## Objective

This notification system aims at offering a reliable and scalable platform that helps deliver notifications in real time. Some features included in this system are the creation, deletion, fetching, and updating of notifications.

---

# Core Features

These are some core features of the notification system:

1. Creation of notifications
2. Fetching notifications
3. Marking notifications as read
4. Deleting notifications
5. Getting the unread notifications' count
6. Delivering notifications in real time
7. Notification filtering and pagination

---

# REST API Design

## 1. Create Notification API

### Endpoint

```http
POST /notifications
```

### Objective

Creates a new notification for a user.

### Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Body

```json
{
  "userId": "1042",
  "title": "Placement Update",
  "message": "Google shortlisted your profile",
  "type": "Placement"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notificationId": "notif_101"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid request body"
}
```

---

## 2. Fetch Notifications API

### Endpoint

```http
GET /notifications
```

### Objective

Fetches all notifications of a user.

### Headers

```http
Authorization: Bearer <token>
```

### Query Parameters

```txt
?page=1&limit=10
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_101",
      "title": "Placement Update",
      "message": "Google shortlisted your profile",
      "type": "Placement",
      "isRead": false,
      "createdAt": "2026-05-11T10:00:00Z"
    }
  ]
}
```

---

## 3. Mark Notification as Read API

### Endpoint

```http
PATCH /notifications/:id/read
```

### Objective

Marks a notification as read.

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 4. Delete Notification API

### Endpoint

```http
DELETE /notifications/:id
```

### Objective

Deletes a notification.

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 5. Get Unread Notification Count API

### Endpoint

```http
GET /notifications/unread-count
```

### Objective

Returns the number of unread notifications.

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
{
  "success": true,
  "count": 5
}
```

---

# Real-Time Notification Mechanism

WebSockets or Socket.io can be employed to facilitate real-time notifications.

## Working Flow

1. User logs into the application.
2. The frontend creates a WebSocket connection to the server.
3. When there is a creation of a notification on the backend, the notification is pushed immediately to the client.
4. This update is received by the frontend, which updates the user interface without refreshing the page.

---

# Advantages of Real-Time Notifications

1. Instant notification delivery
2. Improved user experience
3. Minimal use of API polling
4. Efficient client-server communication

# Naming Conventions Applied

1. Naming conventions of RESTful APIs are applied.
2. Responses in JSON format are uniform in all APIs.
3. HTTP methods have been applied in accordance with the required actions:
   - GET -> Retrieve
   - POST -> Create
   - PATCH -> Update
   - DELETE -> Delete

---

# Conclusion

The above API design is scalable and maintainable with CRUD functionality, pagination, authentication, and real-time communication capabilities.

# Stage 2

## Database Design

For this system, PostgreSQL is used because notifications require filtering, sorting, pagination, and indexing. Since the data is structured, a relational database works well for storing notifications efficiently.

---

# Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Important Fields

| Column | Purpose |
|---|---|
| id | Unique notification ID |
| student_id | Student receiving notification |
| notification_type | Placement, Result, Event |
| is_read | Read/unread status |
| created_at | Notification timestamp |

---

# Possible Scaling Problems

1. Slow queries when notifications become very large.
2. High database load during peak usage.
3. Slower pagination on millions of records.

---

# Optimizations

## Indexing

```sql
CREATE INDEX idx_student_id
ON notifications(student_id);
```

This improves notification fetching speed.

---

## Pagination

```txt
?page=1&limit=10
```

Pagination prevents loading too much data at once.

---

## Redis Caching

Unread counts and recent notifications can be cached to reduce database load.

---

# Example Queries

## Fetch Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC
LIMIT 10;
```

---

## Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notif_101';
```

---

# Conclusion

The database design focuses on scalability and fast notification retrieval using indexing, pagination, and caching techniques.