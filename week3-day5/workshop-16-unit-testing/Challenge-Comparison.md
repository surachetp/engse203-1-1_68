# เปรียบเทียบการทำ Challenge ทั้ง 3 ข้อ

## Challenge 1: Test Todo Model (with Mock)
- ทดสอบฟังก์ชันหลักของ Todo Model เช่น getAll, getById, create
- ใช้ mock database เพื่อควบคุมผลลัพธ์และตรวจสอบการเรียกใช้งาน db.query
- เน้นการตรวจสอบโครงสร้างข้อมูลและการเชื่อมต่อกับ database ในสถานการณ์ปกติ

## Challenge 2: Test Error Handling
- ทดสอบการจัดการ error ของ Todo Model ในกรณีต่างๆ เช่น database connection error, invalid data, duplicate key, timeout
- ใช้ mock database เพื่อจำลองการ throw error แต่ละแบบ
- เน้นให้แน่ใจว่าแอปพลิเคชันสามารถรับมือกับข้อผิดพลาดได้ถูกต้อง

## Challenge 3: Test Date/Time Logic
- ทดสอบฟังก์ชันที่เกี่ยวกับตรรกะวันเวลา เช่น getTasksDueToday, getTasksDueThisWeek, getOverdueTasks
- ใช้ mock ข้อมูลที่มีวันที่หลากหลาย เพื่อทดสอบ logic ที่ขึ้นกับเวลา
- เน้นการตรวจสอบความถูกต้องของการคัดกรองและจัดกลุ่มข้อมูลตามช่วงเวลา

---

## ความแตกต่างหลังเพิ่มแต่ละ Challenge
- **Challenge 1** เน้นการทดสอบฟังก์ชันหลักและโครงสร้างข้อมูล
- **Challenge 2** เพิ่มความรัดกุมด้านความเสถียรและความปลอดภัยของระบบ ด้วยการทดสอบ error handling
- **Challenge 3** ขยายขอบเขตการทดสอบไปยัง business logic ที่ซับซ้อนขึ้น โดยเฉพาะ logic ที่ขึ้นกับเวลา

### สรุป
แต่ละ Challenge ช่วยเสริมความสมบูรณ์ของชุดทดสอบในมุมที่ต่างกัน ทั้งการใช้งานปกติ การรับมือ error และการตรวจสอบ logic เฉพาะทาง ทำให้ระบบมีความน่าเชื่อถือและครอบคลุมมากขึ้น
