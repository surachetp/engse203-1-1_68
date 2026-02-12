const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// ต้องมาก่อน /:id
router.get('/stats', todoController.getStats);

router.get('/', todoController.getAll);
router.get('/:id', todoController.getById);
router.post('/', todoController.create);
router.patch('/:id', todoController.updateStatus);
router.delete('/:id', todoController.delete);

module.exports = router;
