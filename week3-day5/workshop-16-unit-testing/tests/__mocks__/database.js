// tests/__mocks__/database.js
let todos = [
  { id: 1, task: 'Test todo 1', done: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: 2, task: 'Test todo 2', done: true, priority: 'low', createdAt: new Date().toISOString() }
];

function query(sql, params) {
  // Simulate error for test
  if (query._forceError) {
    return Promise.reject(new Error(query._forceError));
  }
  if (sql.startsWith('SELECT * FROM todos WHERE id = ?')) {
    const id = params[0];
    const found = todos.filter(t => t.id === id);
    if (found.length === 0) {
      return Promise.reject(new Error('Todo not found'));
    }
    return Promise.resolve(found);
  }
  if (sql.startsWith('SELECT * FROM todos')) {
    return Promise.resolve([...todos]);
  }
  if (sql.startsWith('INSERT INTO todos SET ?')) {
    const data = params || {};
    // Simulate duplicate
    if (todos.some(t => t.task === data.task)) {
      return Promise.reject({ code: 'ER_DUP_ENTRY', message: 'Duplicate entry' });
    }
    const newId = todos.length + 1;
    const newTodo = { id: newId, ...data, createdAt: new Date().toISOString() };
    todos.push(newTodo);
    return Promise.resolve({ insertId: newId });
  }
  if (sql.startsWith('UPDATE todos SET ? WHERE id = ?')) {
    const [data, id] = params;
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) {
      return Promise.resolve({ affectedRows: 0 });
    }
    todos[idx] = { ...todos[idx], ...data };
    return Promise.resolve({ affectedRows: 1 });
  }
  if (sql.startsWith('DELETE FROM todos WHERE id = ?')) {
    const id = params[0];
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) {
      return Promise.resolve({ affectedRows: 0 });
    }
    todos.splice(idx, 1);
    return Promise.resolve({ affectedRows: 1 });
  }
  return Promise.resolve([]);
}

query._forceError = null;

function _reset() {
  todos = [
    { id: 1, task: 'Test todo 1', done: false, priority: 'medium', createdAt: new Date().toISOString() },
    { id: 2, task: 'Test todo 2', done: true, priority: 'low', createdAt: new Date().toISOString() }
  ];
  query._forceError = null;
}

module.exports = {
  query,
  _reset
};
