# API Documentation
# 📊 ผลการทดลอง - Workshop 10 Level 1

## ผู้ทดลอง
- ชื่อ: [Surachet Pengcom]
- วันที่: [6-Feb-2026]

## Users Endpoints

### 1. GET /api/users
- Description: Get all users
- Query params: `page`, `limit` (for pagination)
- Response:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
    // ...more users
  ]
}
```

### 2. GET /api/users/search
- Description: Search users by name or email
- Query params: `q` (search keyword)
- Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
    // ...more users
  ]
}
```

### 3. GET /api/users/:id
- Description: Get user by ID
- Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. POST /api/users
- Description: Create a new user
- Body:
```json
{
  "name": "New User",
  "email": "newuser@example.com"
}
```
- Response:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New User",
    "email": "newuser@example.com"
  }
}
```
- Error (validation):
```json
{
  "success": false,
  "error": {
    "message": "Invalid user data"
  }
}
```

### 5. PUT /api/users/:id
- Description: Update user by ID
- Body: Same as POST
- Response: Same as POST

### 6. DELETE /api/users/:id
- Description: Delete user by ID
- Response:
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## Middleware

- logger.js: Logs requests (method, URL, timestamp)
- requestTimer.js: Tracks request duration and adds timing info to response
- errorHandler.js: Handles errors and sends error responses
- validateUser.js: Validates user input for POST/PUT requests

---

## Example Request
```bash
curl http://localhost:3000/api/users
```

## Example Search
```bash
curl http://localhost:3000/api/users/search?q=john
```

## Example Pagination
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

---

## Error Codes
- 400: Bad Request (missing/invalid parameters)
- 404: Not Found (user not found)
- 500: Internal Server Error

---

## Notes
- All endpoints return JSON responses.
- Validation middleware ensures user data integrity.
- Pagination and search are available for users.
- Middleware logs and times requests for easier debugging.
