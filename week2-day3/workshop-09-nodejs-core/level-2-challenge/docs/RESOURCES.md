# 📚 Resources — Task Manager CLI

## Node.js File System Documentation
**Official Docs:** https://nodejs.org/api/fs.html

### Key Methods Used in Project:
- **`fs.access(path[, mode])`** - Check file existence and permissions
  ```javascript
  const filePath = '/path/to/file';
  try {
    await fs.access(filePath);
    console.log('File exists');
  } catch (err) {
    console.log('File does not exist');
  }
  ```
- **`fs.readFile(path[, encoding])`** - Read file contents
  ```javascript
  const content = await fs.readFile('data.json', 'utf8');
  ```
- **`fs.writeFile(path, data[, encoding])`** - Write to file
  ```javascript
  await fs.writeFile('output.json', JSON.stringify(data), 'utf8');
  ```
- **`fs.mkdir(path[, options])`** - Create directory (with recursive option)
  ```javascript
  await fs.mkdir('./data', { recursive: true });
  ```

**Used in:** `modules/storage.js` for file I/O operations

---

## Node.js Path Module
**Official Docs:** https://nodejs.org/api/path.html

### Key Methods Used in Project:
- **`path.resolve(...paths)`** - Resolve absolute path
  ```javascript
  const filePath = path.resolve('./data/tasks.json');
  ```
- **`path.dirname(path)`** - Get directory name
  ```javascript
  const dir = path.dirname(filePath); // './data'
  ```

**Used in:** `modules/storage.js` for path normalization and directory extraction

---

## UUID Package (v4)
**Official NPM:** https://www.npmjs.com/package/uuid  
**GitHub:** https://github.com/uuidjs/uuid

### Installation:
```bash
npm install uuid
```

### Usage in Project:
```javascript
const { v4: uuidv4 } = require('uuid');

const id = uuidv4(); // e.g., '550e8400-e29b-41d4-a716-446655440000'
```

**Note:** Currently imported in `modules/taskManager.js` but not actively used (using numeric IDs instead for simplicity)

---

## Chalk Package
**Official NPM:** https://www.npmjs.com/package/chalk  
**GitHub:** https://github.com/chalk/chalk

### Installation:
```bash
npm install chalk
```

### Usage in Project (modules/logger.js):
```javascript
const chalk = require('chalk');

// Colored output
console.log(chalk.green('✔ Success'));      // Green text
console.log(chalk.red('✖ Error'));          // Red text
console.log(chalk.yellow('⚠ Warning'));     // Yellow text
console.log(chalk.blue('ℹ Info'));          // Blue text

// Styling combinations
console.log(chalk.bold.green('Important'));
console.log(chalk.bgRed.white('Alert'));
```

**Used in:** `modules/logger.js` for colored console output

---

## dotenv Package (Bonus)
**Official NPM:** https://www.npmjs.com/package/dotenv  
**GitHub:** https://github.com/motdotla/dotenv

### Installation:
```bash
npm install dotenv
```

### Usage:
```javascript
require('dotenv').config();

const appName = process.env.APP_NAME;     // from .env file
const dataFile = process.env.DATA_FILE;
```

**Used in:** `modules/config.js` for environment variable management

---

## Package.json Dependencies
**Current project uses:**

```json
{
  "dependencies": {
    "chalk": "^4.1.2",
    "dotenv": "^17.2.3",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

---

## Quick Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (.env)
```env
APP_NAME=Task Manager CLI
DATA_FILE=./data/tasks.json
LOG_LEVEL=info
```

### 3. Create Data Directory
```bash
mkdir -p data
```

### 4. Run CLI
```bash
node index.js --help
node index.js add "Task title" high
node index.js list
node index.js search "keyword"
```

---

## Learning Resources

### Node.js Async/Await & Promises
- **MDN Docs:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- **Node.js Guides:** https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/

### File System Best Practices
- Always use `fs.promises` API (async/await) instead of callback-based API
- Handle file not found gracefully (use try-catch)
- Use `path.resolve()` for absolute path handling
- Create directories with `{ recursive: true }` to avoid errors

### JSON Handling
- Use `JSON.stringify(data, null, 2)` for pretty printing
- Always wrap `JSON.parse()` in try-catch for error handling
- Validate JSON structure after parsing

### CLI Best Practices
- Use meaningful error messages
- Provide help/usage information
- Color-code output for better UX
- Log operations for debugging

---

## Related Workshops
- **Workshop 09:** Node.js Core (File System, Modules)
- **Workshop 10:** Express Basics
- **Workshop 13:** SQLite Database
- **Workshop 14:** Database Integration

---

## Troubleshooting

### Issue: "Cannot find module 'chalk'"
**Solution:** Run `npm install` to install dependencies

### Issue: ".env not found"
**Solution:** Create `.env` file in project root with required variables

### Issue: "Task file not found"
**Solution:** Create `data/` directory or ensure `DATA_FILE` path is correct

### Issue: "fs.promises is undefined"
**Solution:** Use `const fs = require('fs').promises;` (Node.js 12.11+)

---

## Version Info
- **Node.js:** v14.0.0+ (with async/await support)
- **npm:** v6.0.0+
- **Project:** Task Manager CLI v1.0.0
- **Last Updated:** 2026-02-06

