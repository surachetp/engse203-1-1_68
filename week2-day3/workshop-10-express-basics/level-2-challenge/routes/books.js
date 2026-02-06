// routes/books.js
const express = require('express');
const router = express.Router();

const dataStore = require('../data/dataStore');
const validate = require('../middleware/validate'); // ✅ แก้ตรงนี้ (ไม่ destructure)

/**
 * GET /api/books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  let books = dataStore.getAllBooks();

  const { genre } = req.query;
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  // filter by genre (case-insensitive)
  if (genre) {
    const genreLower = genre.toLowerCase();
    books = books.filter(
      b => (b.genre || '').toLowerCase() === genreLower
    );
  }

  // pagination
  const start = (page - 1) * limit;
  const paged = books.slice(start, start + limit);

  // attach author
  const results = paged.map(b => ({
    ...b,
    author: dataStore.getAuthorById(b.authorId) || null
  }));

  res.json(results);
});

/**
 * GET /api/books/search
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);

  const qLower = q.toLowerCase();
  const matches = dataStore
    .getAllBooks()
    .filter(b =>
      (b.title || '').toLowerCase().includes(qLower)
    )
    .map(b => ({
      ...b,
      author: dataStore.getAuthorById(b.authorId) || null
    }));

  res.json(matches);
});

/**
 * GET /api/books/:id
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = dataStore.getBookById(id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json({
    ...book,
    author: dataStore.getAuthorById(book.authorId) || null
  });
});

/**
 * POST /api/books
 */
router.post('/', validate.validateBook, (req, res) => {
  const { authorId } = req.body;

  if (!dataStore.getAuthorById(authorId)) {
    return res.status(400).json({ message: 'Invalid authorId' });
  }

  const newBook = dataStore.addBook(req.body);

  res.status(201).json({
    ...newBook,
    author: dataStore.getAuthorById(newBook.authorId) || null
  });
});

/**
 * PUT /api/books/:id
 */
router.put('/:id', validate.validateBook, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = dataStore.getBookById(id);

  if (!existing) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (
    req.body.authorId &&
    !dataStore.getAuthorById(req.body.authorId)
  ) {
    return res.status(400).json({ message: 'Invalid authorId' });
  }

  const updated = dataStore.updateBook(id, req.body);

  res.json({
    ...updated,
    author: dataStore.getAuthorById(updated.authorId) || null
  });
});

/**
 * DELETE /api/books/:id
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = dataStore.deleteBook(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json({
    ...deleted,
    author: dataStore.getAuthorById(deleted.authorId) || null
  });
});

module.exports = router;
