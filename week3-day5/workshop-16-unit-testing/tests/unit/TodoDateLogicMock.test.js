// tests/unit/TodoDateLogicMock.test.js
// เพิ่มเติม: ตัวอย่างฟังก์ชัน date/time logic ต้องมีใน businessRules.js
const businessRules = require('../../src/utils/businessRules');

describe('Todo Date/Time Logic', () => {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const thisWeek = new Date(today); thisWeek.setDate(today.getDate() + 3);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 8);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const mockTasks = [
    { id: 1, task: 'Today', dueDate: today.toISOString() },
    { id: 2, task: 'Tomorrow', dueDate: tomorrow.toISOString() },
    { id: 3, task: 'This Week', dueDate: thisWeek.toISOString() },
    { id: 4, task: 'Next Week', dueDate: nextWeek.toISOString() },
    { id: 5, task: 'Overdue', dueDate: yesterday.toISOString() },
  ];

  it('should return tasks due today', () => {
    const result = businessRules.getTasksDueToday(mockTasks);
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Today' })
    ]));
  });

  it('should return tasks due this week', () => {
    const result = businessRules.getTasksDueThisWeek(mockTasks);
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Today' }),
      expect.objectContaining({ task: 'Tomorrow' }),
      expect.objectContaining({ task: 'This Week' })
    ]));
    expect(result).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Next Week' })
    ]));
  });

  it('should return overdue tasks', () => {
    const result = businessRules.getOverdueTasks(mockTasks);
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Overdue' })
    ]));
    expect(result).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Today' })
    ]));
  });
});

// จุดที่เพิ่มเติม: ต้องมีฟังก์ชัน getTasksDueToday, getTasksDueThisWeek, getOverdueTasks ใน businessRules.js