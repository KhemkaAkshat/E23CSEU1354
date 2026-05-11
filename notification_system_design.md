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