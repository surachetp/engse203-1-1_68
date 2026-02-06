# API Documentation — Book Library 📚

## Overview ✨
Base URL: `http://<host>:<port>/api`

This document lists all available endpoints for the Book Library API (Authors & Books).

---

## Common behavior
- JSON request/response
- Validation middleware used for `POST`/`PUT` on authors and books (returns 400 on validation error).
- Typical error responses:
  - `400 Bad Request` — validation failed, invalid `authorId`, or business rule (e.g., delete author with books)
  - `404 Not Found` — resource not found

---

## Authors API 🧑‍💼

### GET /api/authors
- Description: Get all authors.
- Query params (optional):
  - `country` — filter by country (exact match)
- Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "name": "J.K. Rowling", "country": "UK", "birthYear": 1965 },
    ...
  ]
}
```


### GET /api/authors/:id
- Description: Get author by ID, including their books.
- Response (200):
```json
{
  "success": true,
  "data": { "id": 1, "name": "J.K. Rowling", "country": "UK", "birthYear": 1965, "books": [/* author's books */] }
}
```
- Errors:
  - `404` if author not found


### POST /api/authors
- Description: Create a new author.
- Body (JSON):
```json
{ "name": "Name", "country": "Country", "birthYear": 1970 }
```
- Validation rules:
  - `name`: string, 2–100 chars
  - `country`: string, 2–50 chars
  - `birthYear`: integer, valid year (<= current year)
- Response (201):
```json
{ "success": true, "data": { "id": 4, "name": "..." } }
```


### PUT /api/authors/:id
- Description: Update an author (same validation as POST).
- Response (200): `{ success: true, data: <updated author> }`
- Errors: `404` if author not found


### DELETE /api/authors/:id
- Description: Delete an author.
- Note: Authors cannot be deleted if they still have books. A `400` is returned in that case.
- Response (200): `{ success: true, data: <deleted author> }`
- Errors: `400` if author has books; `404` if not found

---

## Books API 📚

### GET /api/books
- Description: List books.
- Query params:
  - `genre` — filter by genre (case-insensitive exact match)
  - `page` — page number (default `1`)
  - `limit` — page size (default `10`)
- Each book in the response includes an `author` object.
- Example response (200):
```json
[
  {
    "id": 1,
    "title": "Harry Potter...",
    "authorId": 1,
    "year": 1997,
    "genre": "Fantasy",
    "isbn": "9780747532699",
    "author": { "id": 1, "name": "J.K. Rowling", "country": "UK", "birthYear": 1965 }
  },
  ...
]
```


### GET /api/books/search
- Description: Search books by title.
- Query: `?q=searchTerm` (case-insensitive, substring match)
- Response: array of matching books (same shape as above, includes `author`)


### GET /api/books/:id
- Description: Get a single book by ID (includes `author`).
- Response (200): single book object
- Errors: `404` if book not found


### POST /api/books
- Description: Create a new book.
- Body (JSON) — Validation rules (see `middleware/validate.js`):
```json
{
  "title": "string (1-200)",
  "authorId": 1,
  "year": 1997,
  "genre": "string",
  "isbn": "digits or -"
}
```
- Additional checks:
  - `authorId` must refer to an existing author (400 if invalid)
- Response (201): created book with `author` embedded


### PUT /api/books/:id
- Description: Update a book (same validation as POST).
- Additional checks:
  - If `authorId` is provided, it must exist (400 if invalid)
- Response (200): updated book with `author` embedded
- Errors: `404` if book not found


### DELETE /api/books/:id
- Description: Delete a book by ID.
- Response (200): deleted book object (includes `author`)
- Errors: `404` if book not found

---

## Examples & Notes 💡
- Search example: `GET /api/books/search?q=harry`
- Pagination example: `GET /api/books?page=2&limit=5`

> Note: No authentication is required for these endpoints in the current implementation.

---

If you want, I can add example curl commands and a small Postman collection next. ✅
