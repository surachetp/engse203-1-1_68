// routes/users.js
const express = require('express');
const router = express.Router();

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user' },
  { id: 5, name: 'Tom Lee', email: 'tom@example.com', role: 'admin' }
];

/**
 * GET /api/users
 * Query params:
 * - ?role=admin
 * - ?page=1&limit=2
 */
router.get('/', (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;

  let filteredUsers = users;

  // filter by role
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }

  // pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    page: pageNum,
    limit: limitNum,
    total: filteredUsers.length,
    totalPages: Math.ceil(filteredUsers.length / limitNum),
    data: paginatedUsers
  });
});

/**
 * GET /api/users/search
 * Query params: ?q=john
 */
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Query parameter q is required'
      }
    });
  }

  const keyword = q.toLowerCase();

  const results = users.filter(user =>
    user.name.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword)
  );

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/users/:id
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users
 * Body: { name, email, role }
 */
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required'
      }
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;
