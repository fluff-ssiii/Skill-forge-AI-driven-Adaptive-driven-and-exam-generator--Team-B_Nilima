# API Documentation

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://api.springpro.com` (example)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from `/auth/register` or `/auth/authenticate` endpoints and are valid for 24 hours.

---

## Authentication Endpoints

### Register New User

Create a new user account and receive a JWT token.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "fullName": "string (required, 2-100 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 8 characters)",
  "role": "string (required, enum: STUDENT, INSTRUCTOR, ADMIN)"
}
```

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "createdAt": "2025-12-10T13:00:00Z"
  }
}
```

**Error Responses**:

- **409 Conflict** - Email already registered
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Email already registered",
  "path": "/auth/register"
}
```

- **422 Unprocessable Entity** - Validation errors
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 422,
  "error": "Validation Failed",
  "message": "Invalid input",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "path": "/auth/register"
}
```

---

### Authenticate User

Login with email and password to receive a JWT token.

**Endpoint**: `POST /auth/authenticate`

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "lastLoginAt": "2025-12-10T13:00:00Z"
  }
}
```

**Error Responses**:

- **401 Unauthorized** - Invalid credentials
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "path": "/auth/authenticate"
}
```

- **403 Forbidden** - Account locked
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Account is locked due to multiple failed login attempts",
  "path": "/auth/authenticate"
}
```

---

### Request Password Reset

Request a password reset token to be sent via email.

**Endpoint**: `POST /auth/forgot-password`

**Request Body**:
```json
{
  "email": "string (required)"
}
```

**Success Response** (200 OK):
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Note**: For security, the response is the same whether the email exists or not.

---

### Reset Password

Reset password using the token received via email.

**Endpoint**: `POST /auth/reset-password`

**Request Body**:
```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 characters)"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses**:

- **400 Bad Request** - Invalid or expired token
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid or expired reset token",
  "path": "/auth/reset-password"
}
```

---

### Verify Reset Token

Verify if a password reset token is valid.

**Endpoint**: `GET /auth/verify-reset-token?token={token}`

**Success Response** (200 OK):
```json
{
  "valid": true,
  "email": "john.doe@example.com"
}
```

**Error Response** (400 Bad Request):
```json
{
  "valid": false,
  "message": "Invalid or expired token"
}
```

---

## User Management Endpoints

### Get Current User Profile

Get the profile of the currently authenticated user.

**Endpoint**: `GET /api/users/me`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "STUDENT",
  "emailVerified": true,
  "accountLocked": false,
  "lastLoginAt": "2025-12-10T13:00:00Z",
  "createdAt": "2025-12-01T10:00:00Z",
  "updatedAt": "2025-12-10T13:00:00Z"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/users/me"
}
```

---

### Update Current User Profile

Update the profile of the currently authenticated user.

**Endpoint**: `PUT /api/users/me`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "fullName": "string (optional, 2-100 characters)",
  "email": "string (optional, valid email format)"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "fullName": "John Smith",
  "email": "john.smith@example.com",
  "role": "STUDENT",
  "updatedAt": "2025-12-10T14:00:00Z"
}
```

---

### Change Password

Change the password for the currently authenticated user.

**Endpoint**: `PUT /api/users/me/password`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 characters)"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Current password is incorrect",
  "path": "/api/users/me/password"
}
```

---

### List All Users (Admin Only)

Get a paginated list of all users.

**Endpoint**: `GET /api/users?page={page}&size={size}&role={role}&search={search}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Query Parameters**:
- `page` (optional, default: 0) - Page number
- `size` (optional, default: 20) - Page size
- `role` (optional) - Filter by role (STUDENT, INSTRUCTOR, ADMIN)
- `search` (optional) - Search by name or email

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT",
      "accountLocked": false,
      "createdAt": "2025-12-01T10:00:00Z"
    },
    {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "INSTRUCTOR",
      "accountLocked": false,
      "createdAt": "2025-12-02T11:00:00Z"
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "currentPage": 0,
  "pageSize": 20
}
```

**Error Response** (403 Forbidden):
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied. Admin role required.",
  "path": "/api/users"
}
```

---

### Get User by ID (Admin Only)

Get details of a specific user.

**Endpoint**: `GET /api/users/{id}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "STUDENT",
  "emailVerified": true,
  "accountLocked": false,
  "failedLoginAttempts": 0,
  "lastLoginAt": "2025-12-10T13:00:00Z",
  "createdAt": "2025-12-01T10:00:00Z",
  "updatedAt": "2025-12-10T13:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: 999",
  "path": "/api/users/999"
}
```

---

### Delete User (Admin Only)

Delete a user account.

**Endpoint**: `DELETE /api/users/{id}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Success Response** (204 No Content)

**Error Response** (404 Not Found):
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User not found with id: 999",
  "path": "/api/users/999"
}
```

---

### Lock User Account (Admin Only)

Lock a user account to prevent login.

**Endpoint**: `PUT /api/users/{id}/lock`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Success Response** (200 OK):
```json
{
  "message": "User account locked successfully",
  "userId": 1
}
```

---

### Unlock User Account (Admin Only)

Unlock a previously locked user account.

**Endpoint**: `PUT /api/users/{id}/unlock`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Success Response** (200 OK):
```json
{
  "message": "User account unlocked successfully",
  "userId": 1
}
```

---

## Student Management Endpoints

### List Students

Get a list of all students.

**Endpoint**: `GET /api/students?page={page}&size={size}`

**Headers**: `Authorization: Bearer <token>` (Instructor or Admin role required)

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "age": 20,
      "userId": 5,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

---

### Create Student

Create a new student record.

**Endpoint**: `POST /api/students`

**Headers**: `Authorization: Bearer <token>` (Instructor or Admin role required)

**Request Body**:
```json
{
  "name": "string (required)",
  "age": "integer (required, 1-150)",
  "userId": "integer (optional)"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "age": 20,
  "userId": null,
  "createdAt": "2025-12-10T13:00:00Z"
}
```

---

### Get Student by ID

Get details of a specific student.

**Endpoint**: `GET /api/students/{id}`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "age": 20,
  "userId": 5,
  "createdAt": "2025-12-01T10:00:00Z",
  "updatedAt": "2025-12-05T14:00:00Z"
}
```

---

### Update Student

Update a student record.

**Endpoint**: `PUT /api/students/{id}`

**Headers**: `Authorization: Bearer <token>` (Instructor or Admin role required)

**Request Body**:
```json
{
  "name": "string (optional)",
  "age": "integer (optional, 1-150)"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "age": 21,
  "updatedAt": "2025-12-10T13:00:00Z"
}
```

---

### Delete Student

Delete a student record.

**Endpoint**: `DELETE /api/students/{id}`

**Headers**: `Authorization: Bearer <token>` (Instructor or Admin role required)

**Success Response** (204 No Content)

---

## Analytics Endpoints

### Get Analytics Summary (Admin Only)

Get dashboard metrics and analytics.

**Endpoint**: `GET /api/analytics/summary`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Success Response** (200 OK):
```json
{
  "totalUsers": 1247,
  "activeToday": 342,
  "newThisWeek": 28,
  "newThisMonth": 156,
  "usersByRole": {
    "STUDENT": 1050,
    "INSTRUCTOR": 180,
    "ADMIN": 17
  },
  "registrationTrend": [
    { "date": "2025-12-03", "count": 5 },
    { "date": "2025-12-04", "count": 8 },
    { "date": "2025-12-05", "count": 3 },
    { "date": "2025-12-06", "count": 6 },
    { "date": "2025-12-07", "count": 2 },
    { "date": "2025-12-08", "count": 1 },
    { "date": "2025-12-09", "count": 3 }
  ],
  "loginSuccessRate": 98.7,
  "averageResponseTime": 145
}
```

---

### Get User Activity Logs (Admin Only)

Get recent user activity logs.

**Endpoint**: `GET /api/analytics/user-activity?page={page}&size={size}&userId={userId}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Query Parameters**:
- `page` (optional, default: 0)
- `size` (optional, default: 50)
- `userId` (optional) - Filter by specific user

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "userId": 5,
      "userName": "John Doe",
      "action": "LOGIN",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-12-10T13:00:00Z"
    },
    {
      "id": 2,
      "userId": 5,
      "userName": "John Doe",
      "action": "UPDATE_PROFILE",
      "ipAddress": "192.168.1.1",
      "timestamp": "2025-12-10T13:05:00Z"
    }
  ],
  "totalElements": 500,
  "totalPages": 10,
  "currentPage": 0
}
```

---

### Get Registration Trends (Admin Only)

Get user registration trends over time.

**Endpoint**: `GET /api/analytics/registrations?period={period}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Query Parameters**:
- `period` (optional, default: 7) - Number of days to include

**Success Response** (200 OK):
```json
{
  "period": 7,
  "data": [
    { "date": "2025-12-04", "count": 8, "role": "STUDENT" },
    { "date": "2025-12-04", "count": 2, "role": "INSTRUCTOR" },
    { "date": "2025-12-05", "count": 3, "role": "STUDENT" },
    { "date": "2025-12-06", "count": 6, "role": "STUDENT" }
  ],
  "total": 28
}
```

---

### Export Analytics Data (Admin Only)

Export analytics data in CSV or JSON format.

**Endpoint**: `GET /api/analytics/export?format={format}&type={type}`

**Headers**: `Authorization: Bearer <token>` (Admin role required)

**Query Parameters**:
- `format` (required) - Export format (csv, json)
- `type` (required) - Data type (users, activity, registrations)

**Success Response** (200 OK):
- Content-Type: `text/csv` or `application/json`
- Content-Disposition: `attachment; filename="export.csv"`

---

## Error Response Format

All error responses follow this standard format:

```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 400,
  "error": "Error Type",
  "message": "Human-readable error message",
  "path": "/api/endpoint",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

**Common HTTP Status Codes**:
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful request with no response body
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per minute per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Timestamp when the limit resets

**429 Too Many Requests Response**:
```json
{
  "timestamp": "2025-12-10T13:00:00Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

---

## Versioning

The API currently uses version 1. Future versions will be indicated in the URL:

- Current: `/auth/register`, `/api/users`
- Future: `/v2/auth/register`, `/v2/api/users`

Breaking changes will result in a new API version, while backward-compatible changes will be added to the current version.
