const express = require('express');
const router = express.Router();

// GET product by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    data: {
      id: Number(id),
      name: "Mock Product",
      price: 1000
    }
  });
});

// GET all products
router.get('/', (req, res) => {
  res.json({
    success: true,
    pagination: {
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1
    },
    count: 3,
    data: []
  });
});

module.exports = router;
