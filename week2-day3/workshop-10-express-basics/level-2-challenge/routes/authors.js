// routes/authors.js
// Remark: ไฟล์นี้ใช้จัดการเส้นทาง API ที่เกี่ยวข้องกับข้อมูลผู้แต่ง (Authors)

const express = require('express');
const router = express.Router();

// Remark: dataStore ใช้เป็นแหล่งเก็บข้อมูลชั่วคราวของผู้แต่งและหนังสือ
const dataStore = require('../data/dataStore');

// Remark: validateAuthor เป็น middleware สำหรับตรวจสอบความถูกต้องของข้อมูลผู้แต่งก่อนบันทึก
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors
 * ดึงข้อมูลผู้แต่งทั้งหมด (กรองตาม country ได้)
 */
router.get('/', (req, res) => {
  // Remark: ดึงข้อมูลผู้แต่งทั้งหมดจาก dataStore
  let authors = dataStore.authors;

  // Remark: รับค่าประเทศจาก query string
  const { country } = req.query;

  // Remark: หากมีการระบุประเทศ จะกรองเฉพาะผู้แต่งจากประเทศนั้น
  if (country) {
    authors = authors.filter(author => author.country === country);
  }

  // Remark: ส่งข้อมูลผู้แต่งกลับในรูปแบบ JSON
  res.json({
    success: true,
    count: authors.length,
    data: authors
  });
});

/**
 * GET /api/authors/:id
 * ดึงข้อมูลผู้แต่งตาม ID พร้อมหนังสือ
 */
router.get('/:id', (req, res) => {
  // Remark: แปลงค่า id จาก URL parameter เป็นตัวเลข
  const authorId = Number(req.params.id);

  // Remark: ค้นหาข้อมูลผู้แต่งตาม ID
  const author = dataStore.authors.find(a => a.id === authorId);

  // Remark: หากไม่พบผู้แต่ง ให้ส่งสถานะ 404 กลับไป
  if (!author) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลผู้แต่ง' });
  }

  // Remark: ดึงหนังสือทั้งหมดที่เกี่ยวข้องกับผู้แต่งคนนี้
  const books = dataStore.books.filter(
    book => book.authorId === authorId
  );

  // Remark: ส่งข้อมูลผู้แต่งพร้อมหนังสือกลับไป
  res.json({
    success: true,
    data: {
      ...author,
      books
    }
  });
});

/**
 * POST /api/authors
 * เพิ่มผู้แต่งใหม่
 */
router.post('/', validateAuthor, (req, res) => {
  // Remark: รับข้อมูลผู้แต่งจาก request body
  const { name, country, birthYear } = req.body;

  // Remark: สร้างข้อมูลผู้แต่งใหม่และกำหนด ID อัตโนมัติ
  const newAuthor = {
    id: dataStore.authors.length
      ? dataStore.authors[dataStore.authors.length - 1].id + 1
      : 1,
    name,
    country,
    birthYear
  };

  // Remark: เพิ่มผู้แต่งใหม่ลงใน dataStore
  dataStore.authors.push(newAuthor);

  // Remark: ส่งข้อมูลที่เพิ่มแล้วกลับไป พร้อมสถานะ 201 (Created)
  res.status(201).json({
    success: true,
    data: newAuthor
  });
});

/**
 * PUT /api/authors/:id
 * แก้ไขข้อมูลผู้แต่ง
 */
router.put('/:id', validateAuthor, (req, res) => {
  // Remark: แปลงค่า id จาก URL parameter เป็นตัวเลข
  const authorId = Number(req.params.id);

  // Remark: ค้นหาผู้แต่งที่ต้องการแก้ไข
  const author = dataStore.authors.find(a => a.id === authorId);

  // Remark: หากไม่พบผู้แต่ง ให้ส่งสถานะ 404 กลับไป
  if (!author) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลผู้แต่ง' });
  }

  // Remark: รับข้อมูลใหม่จาก request body
  const { name, country, birthYear } = req.body;

  // Remark: อัปเดตข้อมูลผู้แต่ง
  author.name = name;
  author.country = country;
  author.birthYear = birthYear;

  // Remark: ส่งข้อมูลที่อัปเดตแล้วกลับไป
  res.json({
    success: true,
    data: author
  });
});

/**
 * DELETE /api/authors/:id
 * ลบผู้แต่ง (ถ้ายังมีหนังสือจะลบไม่ได้)
 */
router.delete('/:id', (req, res) => {
  // Remark: แปลงค่า id จาก URL parameter เป็นตัวเลข
  const authorId = Number(req.params.id);

  // Remark: ตรวจสอบว่าผู้แต่งยังมีหนังสือที่เกี่ยวข้องอยู่หรือไม่
  const hasBooks = dataStore.books.some(
    book => book.authorId === authorId
  );

  // Remark: หากยังมีหนังสือ จะไม่อนุญาตให้ลบผู้แต่ง
  if (hasBooks) {
    return res.status(400).json({
      message: 'ไม่สามารถลบผู้แต่งได้ เนื่องจากยังมีหนังสืออยู่'
    });
  }

  // Remark: ค้นหาตำแหน่ง index ของผู้แต่งในอาเรย์
  const index = dataStore.authors.findIndex(
    author => author.id === authorId
  );

  // Remark: หากไม่พบผู้แต่ง ให้ส่งสถานะ 404 กลับไป
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลผู้แต่ง' });
  }

  // Remark: ลบข้อมูลผู้แต่งออกจาก dataStore
  const deletedAuthor = dataStore.authors.splice(index, 1);

  // Remark: ส่งข้อมูลผู้แต่งที่ถูกลบกลับไป
  res.json({
    success: true,
    data: deletedAuthor[0]
  });
});

// Remark: export router เพื่อให้ไฟล์หลักนำไปใช้งาน
module.exports = router;
