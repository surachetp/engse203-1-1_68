// tests/unit/TodoDateLogic.test.js
const TodoUtils = require('../../src/utils/businessRules');

// ตัวอย่าง mock tasks
const mockTasks = [
  { id: 1, task: 'Today', dueDate: new Date().toISOString() },
  { id: 2, task: 'Tomorrow', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString(); })() },
  { id: 3, task: 'This Week', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString(); })() },
  { id: 4, task: 'Next Week', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 8); return d.toISOString(); })() },
  { id: 5, task: 'Overdue', dueDate: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString(); })() },
];

describe('Todo Date/Time Logic', () => {
  describe('getTasksDueToday', () => {
    it('should return tasks due today', () => {
      const result = TodoUtils.getTasksDueToday(mockTasks);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ task: 'Today' })
      ]));
    });
  });

  describe('getTasksDueThisWeek', () => {
    it('should return tasks due this week', () => {
      const result = TodoUtils.getTasksDueThisWeek(mockTasks);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ task: 'Today' }),
        expect.objectContaining({ task: 'Tomorrow' }),
        expect.objectContaining({ task: 'This Week' })
      ]));
      expect(result).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ task: 'Next Week' })
      ]));
    });
  });

  describe('getOverdueTasks', () => {
    it('should return overdue tasks', () => {
      const result = TodoUtils.getOverdueTasks(mockTasks);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ task: 'Overdue' })
      ]));
      expect(result).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ task: 'Today' })
      ]));
    });
  });
});

// เพิ่มเติม: mockTasks ใช้วันที่แบบ dynamic เพื่อให้ test time-sensitive functions ได้เสมอ