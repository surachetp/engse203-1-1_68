# 📊 บันทึกผลการทดลอง - Workshop 14 Level 1 (Todo API)

**ผู้ทดลอง**
- ชื่อ: นาย สุรเชษฐ์ เป็งคำ 
- รหัสนักศึกษา: 68543210080-6
- วันที่: February 6, 2026

---

## Project Structure
---

## 🚀 การเริ่มต้น Server
**คำสั่งที่ใช้:**
```
npm start
# หรือ
npm run dev  # (สำหรับ development mode with nodemon)
```
**ผลลัพธ์:**
- ✅ Connected to database
- 🚀 Server running on http://localhost:3000
- 📚 API docs: http://localhost:3000/api/todos

**สังเกต:**
- Database connection สำเร็จ
- Server รันที่ port 3000
- พร้อมรับ HTTP requests

---

## 🧪 ตัวอย่างการทดสอบ API

### 1️⃣ GET All Todos
Request:
GET http://localhost:3000/api/todos
cURL:
curl http://localhost:3000/api/todos

### 2️⃣ POST Create Todo
Request:
POST http://localhost:3000/api/todos
Body: { "task": "เรียน MongoDB" }
cURL:
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"task":"เรียน MongoDB"}'

### 3️⃣ PATCH Update Status
Request:
PATCH http://localhost:3000/api/todos/1
Body: { "done": true }
cURL:
curl -X PATCH http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"done":true}'

### 4️⃣ DELETE Todo
Request:
DELETE http://localhost:3000/api/todos/6
cURL:
curl -X DELETE http://localhost:3000/api/todos/6

### 5️⃣ GET Stats
Request:
GET http://localhost:3000/api/todos/stats
cURL:
curl http://localhost:3000/api/todos/stats

---

## 🗄️ SQL ที่ใช้ในระบบ
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_timestamp 
AFTER UPDATE ON todos
BEGIN
  UPDATE todos SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;
```

---

## 🔒 Security Features
- ใช้ prepared statements ป้องกัน SQL Injection
- ตรวจสอบ input validation (task, done)
- มี error handling ที่ชัดเจน

---

## 🎓 สิ่งที่ได้เรียนรู้
- การเชื่อมต่อ SQLite กับ Express
- การใช้ better-sqlite3
- การออกแบบ RESTful API
- การจัดการ error และ security เบื้องต้น
```
todo-api/
├── server.js              # Entry point
├── .env                   # Environment variables
├── database/
│   └── todos.db          # SQLite database
└── src/
  ├── app.js            # Express app configuration
  ├── db.js             # Database connection manager
  ├── controllers/      # Business logic
  │   └── todoController.js
  ├── models/           # Data access layer
  │   └── Todo.js
  ├── routes/           # API routes
  │   └── todoRoutes.js
  └── middleware/       # Custom middleware
    └── errorHandler.js
```
## API Endpoints

## API Endpoints

### Todos
- `GET /api/todos` — ดึง todos ทั้งหมด
  - ตัวเลือก: `done`, `search`, `page`, `limit`
  - ตัวอย่าง: `/api/todos?done=true&search=งาน&page=1&limit=10`
- `GET /api/todos/:id` — ดึง todo ตาม ID
- `POST /api/todos` — สร้าง todo ใหม่
- `PUT /api/todos/:id` — อัพเดทสถานะ todo
- `DELETE /api/todos/:id` — ลบ todo

### Stats
- `GET /api/todos/stats` — ดูสถิติ todos

## หมายเหตุ
- ฟีเจอร์ Challenge: filter, search, pagination สามารถใช้ query string ได้
- ทุก endpoint คืนค่า JSON

