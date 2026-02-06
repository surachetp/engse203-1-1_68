// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
    constructor() {
        // กำหนด path ของไฟล์ข้อมูลหลักจาก config
        this.dataFile = config.dataFile;
    }

    // อ่านข้อมูล tasks จากไฟล์
    async read() {
        try {
            // TODO: ตรวจสอบว่าไฟล์มีอยู่หรือไม่
            // ถ้าไม่มี ให้ return empty array
            // ถ้ามี ให้อ่านและ parse JSON
            // คำแนะนำ: ใช้ fs.access() เพื่อเช็คว่าไฟล์มีอยู่
            // ใช้ fs.readFile() เพื่ออ่านไฟล์
            // ใช้ JSON.parse() เพื่อแปลงเป็น object
            const filePath = path.resolve(this.dataFile);
            try {
                await fs.access(filePath);
            } catch (err) {
                // ถ้าไม่พบไฟล์ ให้คืนค่า array ว่าง
                return [];
            }

            // ป้องกันกรณีไฟล์ว่าง
            const content = await fs.readFile(filePath, 'utf8');
            if (!content) return [];

            // แปลง JSON string เป็น object
            const data = JSON.parse(content);

            // ระบบนี้คาดหวังข้อมูลเป็น Array เท่านั้น
            // หากโครงสร้างผิด จะคืนค่า array ว่าง
            return Array.isArray(data) ? data : [];
        } catch (error) {
            logger.error(`Failed to read data: ${error.message}`);
            return [];
        }
    }

    // บันทึกข้อมูล tasks ลงไฟล์
    async write(data) {
        try {
            const filePath = path.resolve(this.dataFile);
            const dir = path.dirname(filePath);

            // สร้างโฟลเดอร์ถ้ายังไม่มี
            // recursive: true ป้องกัน error หากโฟลเดอร์มีอยู่แล้ว
            await fs.mkdir(dir, { recursive: true });
            // แปลงเป็น JSON แบบ pretty print
            const json = JSON.stringify(data, null, 2);

            // เขียนข้อมูลลงไฟล์
            await fs.writeFile(filePath, json, 'utf8');

            logger.success('Data saved successfully');
            return true;
        } catch (error) {
            logger.error(`Failed to write data: ${error.message}`);
            throw error;
        }
    }

    // Export tasks ไปยังไฟล์อื่น
    async exportTo(filename, data) {
        try {
            const filePath = path.resolve(filename);
            const dir = path.dirname(filePath);

            // ทำงานคล้าย write() แต่ใช้ไฟล์ปลายทางที่ผู้ใช้ระบุ
            // เพื่อไม่กระทบไฟล์ข้อมูลหลัก
            await fs.mkdir(dir, { recursive: true });

            const json = JSON.stringify(data, null, 2);
            await fs.writeFile(filePath, json, 'utf8');

            logger.success(`Exported data to ${filePath}`);
            return true;
        } catch (error) {
            logger.error(`Failed to export: ${error.message}`);
            throw error;
        }
    }

    // Import tasks จากไฟล์อื่น
    async importFrom(filename) {
        try {
            const filePath = path.resolve(filename);

            // ตรวจสอบว่าไฟล์มีอยู่
            await fs.access(filePath);
            const content = await fs.readFile(filePath, 'utf8');

            // ป้องกันกรณีไฟล์ว่างหรือข้อมูลไม่สมบูรณ์
            if (!content) return [];
            const data = JSON.parse(content);

            // ตรวจสอบว่าโครงสร้างข้อมูลถูกต้องก่อน return
            return Array.isArray(data) ? data : [];
        } catch (error) {
            logger.error(`Failed to import: ${error.message}`);
            throw error;
        }
    }
}
// ใช้ Singleton Pattern เพื่อให้ทั้งระบบใช้งาน Storage instance เดียวกัน
module.exports = new Storage();
