// src/models/Todo.js
const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด พร้อม filter/search/pagination
   */
  getAll({ done, search, page = 1, limit = 10 } = {}) {
    let sql = 'SELECT * FROM todos';
    const conditions = [];
    const params = [];
    if (done !== undefined) {
      conditions.push('done = ?');
      params.push(done === 'true' ? 1 : 0);
    }
    if (search) {
      conditions.push('task LIKE ?');
      params.push(`%${search}%`);
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY created_at DESC';
    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit));
    params.push((Number(page) - 1) * Number(limit));
    return this.db.prepare(sql).all(...params);
  }

  /**
   * ดึง todo ตาม ID
   */
  getById(id) {
    const sql = `SELECT * FROM todos WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  /**
   * สร้าง todo ใหม่
   */
  create(task) {
    const sql = `
      INSERT INTO todos (task)
      VALUES (?)
    `;
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  /**
   * อัพเดทสถานะ
   */
  updateStatus(id, done) {
    const sql = `
      UPDATE todos
      SET done = ?
      WHERE id = ?
    `;
    const result = this.db.prepare(sql).run(done, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getById(id);
  }

  /**
   * ลบ todo
   */
  delete(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * ดูสถิติ
   */
  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();