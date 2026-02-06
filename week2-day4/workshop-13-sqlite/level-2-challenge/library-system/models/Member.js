// models/Member.js
const { db } = require('../db');

class Member {
  // ดึงสมาชิกทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  // ดูหนังสือที่สมาชิกยืมอยู่
  static getBorrowedBooks(memberId) {
    // TODO: JOIN กับ books และ borrowings
    // แสดง: book title, author, borrow_date
    // เฉพาะที่ยังไม่คืน (return_date IS NULL)
    
    // YOUR CODE HERE
    const sql = `
      SELECT 
        books.title,
        books.author,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  // เพิ่มสมาชิกใหม่
  static add(name, email, phone) {
    // TODO: เพิ่มสมาชิกใหม่
    
    // YOUR CODE HERE
    
  }
}

module.exports = Member;