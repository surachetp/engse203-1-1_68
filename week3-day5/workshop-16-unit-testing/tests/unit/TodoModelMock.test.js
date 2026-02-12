// tests/unit/TodoModelMock.test.js
// เพิ่มเติม: mock database ด้วย jest.mock ก่อน import Todo
jest.mock('../../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../../src/config/database');
const Todo = require('../../src/models/Todo');

describe('Todo Model (with Mock DB)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all todos', async () => {
      db.query.mockResolvedValue([{ id: 1, task: 'Test' }]);
      const result = await Todo.getAll();
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos');
      expect(result).toEqual([{ id: 1, task: 'Test' }]);
    });
  });

  describe('getById', () => {
    it('should return todo by id', async () => {
      db.query.mockResolvedValue([{ id: 2, task: 'Mocked' }]);
      const result = await Todo.getById(2);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = ?', [2]);
      expect(result).toEqual({ id: 2, task: 'Mocked' });
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      db.query.mockResolvedValue({ insertId: 3 });
      const data = { task: 'New Todo' };
      const result = await Todo.create(data);
      expect(db.query).toHaveBeenCalledWith('INSERT INTO todos SET ?', data);
      expect(result).toEqual({ id: 3, task: 'New Todo' });
    });
  });
});

// จุดที่เพิ่มเติม: ใช้ jest.mock สำหรับ mock database module และตรวจสอบการเรียก db.query ในแต่ละเมธอด