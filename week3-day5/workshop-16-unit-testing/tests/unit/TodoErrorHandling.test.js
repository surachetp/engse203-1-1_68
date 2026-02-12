// tests/unit/TodoErrorHandling.test.js
const Todo = require('../../src/models/Todo');

jest.mock('../../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../../src/config/database');

describe('Todo Model Error Handling', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle database connection error', async () => {
    db.query.mockRejectedValue(new Error('DB connection failed'));
    await expect(Todo.getAll()).rejects.toThrow('DB connection failed');
  });

  it('should handle invalid data format', async () => {
    db.query.mockRejectedValue(new Error('Invalid data format'));
    await expect(Todo.create({ task: 123 })).rejects.toThrow('Invalid data format');
  });

  it('should handle duplicate key error', async () => {
    db.query.mockRejectedValue(new Error('Duplicate entry'));
    await expect(Todo.create({ task: 'Duplicate' })).rejects.toThrow('Duplicate entry');
  });

  it('should handle timeout error', async () => {
    db.query.mockRejectedValue(new Error('Query timeout'));
    await expect(Todo.getById(1)).rejects.toThrow('Query timeout');
  });
});

// เพิ่มเติม: mock db.query ให้ throw error ตามแต่ละ scenario แล้วตรวจสอบว่า Todo method โยน error ถูกต้อง