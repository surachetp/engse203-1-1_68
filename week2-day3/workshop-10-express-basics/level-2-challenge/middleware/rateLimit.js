// middleware/rateLimit.js

/**
 * Middleware สำหรับจำกัดจำนวน request ต่อ IP
 * ป้องกันการยิง API ถี่เกินไป (Rate Limiting)
 */
const rateLimit = () => {
  // ใช้ Map เก็บข้อมูลการ request ของแต่ละ IP
  // รูปแบบ: { ip: [timestamp, timestamp, ...] }
  const requests = new Map();

  return (req, res, next) => {
    // ดึง IP address ของผู้ใช้งาน
    const ip = req.ip || req.connection.remoteAddress;

    // เวลาปัจจุบัน (หน่วยเป็น milliseconds)
    const now = Date.now();

    // ระยะเวลา window (ค่าเริ่มต้น 15 นาที)
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000;

    // จำนวน request สูงสุดที่อนุญาตใน window
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    // ถ้า IP นี้ยังไม่เคยมี request มาก่อน
    // ให้สร้าง array เปล่าไว้เก็บ timestamp
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    // ดึงรายการเวลาที่ IP นี้เคย request
    const requestTimestamps = requests.get(ip);

    // กรองเฉพาะ request ที่ยังอยู่ในช่วง time window
    const recentRequests = requestTimestamps.filter(
      time => now - time < windowMs
    );

    // ถ้าจำนวน request เกิน limit ที่กำหนด
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests, please try again later'
        }
      });
    }

    // บันทึกเวลาของ request ปัจจุบัน
    recentRequests.push(now);

    // อัปเดตข้อมูลกลับเข้าไปใน Map
    requests.set(ip, recentRequests);

    // อนุญาตให้ request ผ่านไปยัง middleware / route ถัดไป
    next();
  };
};

module.exports = rateLimit;
