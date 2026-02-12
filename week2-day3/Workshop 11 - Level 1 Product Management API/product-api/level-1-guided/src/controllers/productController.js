const Product = require('../data/products');

/**
 * GET /api/products
 * ดึงสินค้าทั้งหมด (filters + sort + pagination)
 */
exports.getAll = (req, res) => {
  try {
    let products = Product.getAll();

    // Filter by category
    if (req.query.category) {
      products = products.filter(
        p => p.category === req.query.category
      );
    }

    // Filter by price range
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }

    // Search by name / description
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
      );
    }

    // Filter by stock status
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === 'true';
      products = products.filter(p =>
        inStock ? p.stock > 0 : p.stock === 0
      );
    }

    // Sorting
    const sort = req.query.sort;
    const order = req.query.order === 'desc' ? 'desc' : 'asc';

    if (sort) {
      products.sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    const total = products.length;
    const data = products.slice(start, end);

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

/**
 * GET /api/products/:id
 */
exports.getById = (req, res) => {
  const product = Product.getById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
};

/**
 * POST /api/products
 */
exports.create = (req, res) => {
  const { name, description, price, category, stock } = req.body;

  const newProduct = Product.create({
    name,
    description,
    price: parseFloat(price),
    category,
    stock: parseInt(stock)
  });

  res.status(201).json({
    success: true,
    data: newProduct
  });
};

/**
 * PUT /api/products/:id
 */
exports.update = (req, res) => {
  const updated = Product.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: updated
  });
};

/**
 * PATCH /api/products/:id
 */
exports.partialUpdate = (req, res) => {
  const updated = Product.partialUpdate(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: updated
  });
};

/**
 * DELETE /api/products/:id
 */
exports.remove = (req, res) => {
  const deleted = Product.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(204).send();
};

/**
 * PATCH /api/products/bulk
 */
exports.bulkUpdate = (req, res) => {
  const { ids, updates } = req.body;

  if (!Array.isArray(ids) || !updates) {
    return res.status(400).json({
      success: false,
      message: 'ids array and updates object are required'
    });
  }

  const updatedProducts = [];

  ids.forEach(id => {
    const updated = Product.partialUpdate(id, updates);
    if (updated) updatedProducts.push(updated);
  });

  res.json({
    success: true,
    updatedCount: updatedProducts.length,
    data: updatedProducts
  });
};
