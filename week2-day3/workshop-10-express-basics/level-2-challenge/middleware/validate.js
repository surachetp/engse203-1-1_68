// middleware/validate.js
const Joi = require('joi');

/**
 * Schema สำหรับตรวจสอบข้อมูลผู้แต่ง (Author)
 */
const authorSchema = Joi.object({
  // ชื่อผู้แต่ง ต้องเป็น string ความยาว 2–100 ตัวอักษร
  name: Joi.string().min(2).max(100).required(),

  // ประเทศ ต้องเป็น string ความยาว 2–50 ตัวอักษร
  country: Joi.string().min(2).max(50).required(),

  // ปีเกิด ต้องเป็นตัวเลข และไม่เกินปีปัจจุบัน
  birthYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required()
});

/**
 * Schema สำหรับตรวจสอบข้อมูลหนังสือ (Book)
 */
const bookSchema = Joi.object({
  // ชื่อหนังสือ ต้องมีอย่างน้อย 1 ตัวอักษร
  title: Joi.string().min(1).max(200).required(),

  // authorId ต้องเป็นตัวเลขจำนวนเต็ม
  authorId: Joi.number().integer().required(),

  // ปีที่พิมพ์ ต้องเป็นตัวเลข และไม่เกินปีปัจจุบัน
  year: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),

  // ประเภทหนังสือ
  genre: Joi.string().min(2).max(50).required(),

  // ISBN อนุญาตเฉพาะตัวเลขและเครื่องหมาย -
  isbn: Joi.string()
    .pattern(/^[0-9-]+$/)
    .required()
});

/**
 * ฟังก์ชันสร้าง middleware สำหรับตรวจสอบข้อมูล (Validation Factory)
 */
const validate = (schema) => {
  return (req, res, next) => {
    // นำข้อมูลจาก req.body ไปตรวจสอบกับ schema
    const { error } = schema.validate(req.body, {
      abortEarly: true // เจอ error แรกก็หยุด
    });

    // ถ้ามี error จากการ validate
    if (error) {
      // เพิ่ม flag เพื่อให้ error handler รู้ว่าเป็น Joi error
      error.isJoi = true;

      // ส่งต่อ error ไปให้ error handling middleware
      return next(error);
    }

    // ถ้าข้อมูลถูกต้อง ให้ทำงานต่อไป
    next();
  };
};

module.exports = {
  // middleware สำหรับตรวจสอบข้อมูลผู้แต่ง
  validateAuthor: validate(authorSchema),

  // middleware สำหรับตรวจสอบข้อมูลหนังสือ
  validateBook: validate(bookSchema)
};
