// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
    // ใช้ nextId สำหรับกำหนด id แบบตัวเลข
    // เพื่อให้เข้าใจง่ายและเหมาะกับงานระดับพื้นฐาน
  }

  // โหลด tasks จาก storage
  async loadTasks() {
        // คำนวณ nextId ใหม่จากข้อมูลเดิม
       // เพื่อป้องกัน id ซ้ำเมื่อมีการเพิ่ม task ใหม่
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  // เพิ่ม task ใหม่
  async addTask(title, priority = 'medium', opts = {}) {
    await this.loadTasks();

    // ตรวจสอบ priority ให้รับเฉพาะค่าที่กำหนด
    // หากไม่ถูกต้องจะตั้งค่าเป็น 'medium'
    const validPriorities = ['low', 'medium', 'high'];
    const p = String(priority || 'medium').toLowerCase();
    const finalPriority = validPriorities.includes(p) ? p : 'medium';

    const due = opts.due ? String(opts.due) : null;
    const tags = Array.isArray(opts.tags) ? opts.tags.map(String) : (opts.tags ? [String(opts.tags)] : []);

    // สร้าง task object ใหม่พร้อมข้อมูลพื้นฐาน
    const task = {
      id: this.nextId++,
      title: String(title),
      priority: finalPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (due) task.dueDate = due;
    if (tags.length) task.tags = tags;

    this.tasks.push(task);
    await this.saveTasks();
    
    logger.success(`Task added: "${title}" (ID: ${task.id})`);
    return task;
  }

  // แสดงรายการ tasks
  async listTasks(filter = 'all', opts = {}) {
    await this.loadTasks();

    if (this.tasks.length === 0) {
      logger.warning('No tasks found');
      return;
    }

    const f = String(filter || 'all').toLowerCase();
    let filteredTasks;
    if (f === 'pending') {
      filteredTasks = this.tasks.filter(t => !t.completed);
    } else if (f === 'completed') {
      filteredTasks = this.tasks.filter(t => t.completed);
    } else {
      filteredTasks = this.tasks.slice(); // all
    }

    // filter by tag
    if (opts.tag) {
      filteredTasks = filteredTasks.filter(t => Array.isArray(t.tags) && t.tags.includes(opts.tag));
    }

    // filter by overdue
    if (opts.overdue) {
      const now = new Date();
      filteredTasks = filteredTasks.filter(t => t.dueDate && !t.completed && new Date(t.dueDate) < now);
    }

    if (filteredTasks.length === 0) {
      logger.warning(`No ${f} tasks found`);
      return;
    }

    // sort
    if (opts.sort) {
      if (String(opts.sort).toLowerCase() === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        filteredTasks.sort((a, b) => (order[a.priority] - order[b.priority]));
      } else if (String(opts.sort).toLowerCase() === 'date') {
        filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
    }

    // แสดงผลแบบ table
    logger.info(`\n${f.toUpperCase()} TASKS:\n`);

    const tableData = filteredTasks.map(t => ({
      ID: t.id,
      Title: t.title,
      Priority: t.priority,
      Status: t.completed ? 'completed' : 'pending',
      Due: t.dueDate || '',
      Tags: t.tags ? t.tags.join(',') : '',
      Created: t.createdAt || ''
    }));

    logger.table(tableData);
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ค้นหา tasks โดย keyword
  async searchTasks(query, opts = {}) {
    await this.loadTasks();
    if (!query) {
      logger.warning('Please provide a search query');
      return;
    }

    const q = String(query).toLowerCase();
    let results = this.tasks.filter(t => (t.title && t.title.toLowerCase().includes(q)) || (Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(q))));

    if (opts.tag) {
      results = results.filter(t => Array.isArray(t.tags) && t.tags.includes(opts.tag));
    }

    if (!results || results.length === 0) {
      logger.warning('No matching tasks found');
      return;
    }

    // sort
    if (opts.sort) {
      if (String(opts.sort).toLowerCase() === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        results.sort((a, b) => (order[a.priority] - order[b.priority]));
      } else if (String(opts.sort).toLowerCase() === 'date') {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
    }

    logger.info('\nSEARCH RESULTS:\n');
    const tableData = results.map(t => ({
      ID: t.id,
      Title: t.title,
      Priority: t.priority,
      Status: t.completed ? 'completed' : 'pending',
      Due: t.dueDate || '',
      Tags: t.tags ? t.tags.join(',') : '',
      Created: t.createdAt || ''
    }));

    logger.table(tableData);
    console.log(`\nTotal: ${results.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    // TODO: หา task จาก id
    // TODO: เปลี่ยน completed เป็น true
    // TODO: เพิ่ม completedAt timestamp
    // หา task จาก id
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }

    if (task.completed) {
      logger.warning(`Task ${id} is already completed`);
      return;
    }

    task.completed = true;
    task.completedAt = new Date().toISOString();

    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

    // ลบ task
    // TODO: ลบ task ที่มี id ตรงกัน
    // TODO: ตรวจสอบว่าหา task เจอหรือไม่
  async deleteTask(id) {
    await this.loadTasks();

    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }

    this.tasks.splice(idx, 1);

    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

    // แก้ไข task
     // TODO: หา task และแก้ไข title
    // TODO: เพิ่ม updatedAt timestamp
  async updateTask(id, newTitle) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }

    task.title = String(newTitle);
    task.updatedAt = new Date().toISOString();

    await this.saveTasks();
    logger.success(`Task ${id} updated`);
  }

  // แสดง statistics
  async showStats() {
    await this.loadTasks();
    // TODO: คำนวณ statistics
    // - จำนวน tasks ทั้งหมด
    // - tasks ที่เสร็จแล้ว
    // - tasks ที่รอดำเนินการ
    // - แยกตาม priority (high/medium/low)
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const byPriority = {
      high: this.tasks.filter(t => t.priority === 'high').length,
      medium: this.tasks.filter(t => t.priority === 'medium').length,
      low: this.tasks.filter(t => t.priority === 'low').length,
    };

    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
// แสดงผล statistics
    console.log(`Total tasks    : ${total}`);
    console.log(`Completed      : ${completed}`);
    console.log(`Pending        : ${pending}`);
    console.log('\nBy priority:');
    console.log(`  High   : ${byPriority.high}`);
    console.log(`  Medium : ${byPriority.medium}`);
    console.log(`  Low    : ${byPriority.low}`);
    console.log('');
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
 // TODO: ใช้ storage.exportTo() เพื่อ export
    try {
      await storage.exportTo(filename, this.tasks);
      logger.success(`Tasks exported to ${filename}`);
    } catch (err) {
      logger.error(`Export failed: ${err.message}`);
      throw err;
    }
  }

  // Import tasks
   // TODO: ใช้ storage.importFrom() เพื่อ import
    // TODO: merge กับ tasks ที่มีอยู่ (ถ้ามี)
    // TODO: ระวัง id ซ้ำ
  async importTasks(filename) {
    await this.loadTasks();

    try {
      const imported = await storage.importFrom(filename);
      if (!Array.isArray(imported) || imported.length === 0) {
        logger.warning('No tasks to import');
        return;
      }

      const existingIds = new Set(this.tasks.map(t => Number(t.id)));

      for (const item of imported) {
        // Normalize incoming task
        const incoming = Object.assign({}, item);
        let incomingId = Number(incoming.id);

        if (!Number.isFinite(incomingId) || existingIds.has(incomingId)) {
          // assign new id
          incomingId = this.nextId++;
        } else {
          // reserve id
          if (incomingId >= this.nextId) this.nextId = incomingId + 1;
        }

        incoming.id = incomingId;
        incoming.title = String(incoming.title || '');
        incoming.priority = String(incoming.priority || 'medium').toLowerCase();
        if (!['low','medium','high'].includes(incoming.priority)) incoming.priority = 'medium';
        incoming.completed = Boolean(incoming.completed);
        incoming.createdAt = incoming.createdAt || new Date().toISOString();

        // avoid duplicate id again
        if (!existingIds.has(incoming.id)) {
          this.tasks.push(incoming);
          existingIds.add(incoming.id);
        }
      }

      await this.saveTasks();
      logger.success(`Tasks imported from ${filename}`);
    } catch (err) {
      logger.error(`Import failed: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new TaskManager();
