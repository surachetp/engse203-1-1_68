// models/Book.js
const { db } = require('../db');

class Book {
  // ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books';
    return db.prepare(sql).all();
  }

  // ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    const sql = 'SELECT * FROM books WHERE available = 1';
    return db.prepare(sql).all();
  }

  // ค้นหาหนังสือ
  static search(keyword) {
    const sql = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
    `;
    const pattern = `%${keyword}%`;
    return db.prepare(sql).all(pattern, pattern);
  }

  // เพิ่มหนังสือใหม่
  static add(title, author) {
    const sql = `
      INSERT INTO books (title, author, available)
      VALUES (?, ?, 1)
    `;
    const info = db.prepare(sql).run(title, author);
    // return the newly inserted book record
    return db.prepare('SELECT * FROM books WHERE id = ?').get(info.lastInsertRowid);
  }
}

module.exports = Book;