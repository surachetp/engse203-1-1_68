# Workshop 16: Unit Testing

## คำอธิบายโปรเจกต์

โปรเจกต์นี้เป็นการฝึกเขียน Unit Test ด้วย Jest สำหรับระบบ Todo โดยประกอบด้วยโมดูลหลัก:
- **businessRules**: ตรรกะการจัดการสถานะและความสำคัญของงาน
- **dataProcessing**: ฟังก์ชันจัดการข้อมูล เช่น filter, sort, group, paginate
- **validation**: ตรวจสอบความถูกต้องของข้อมูล เช่น task, priority, dueDate
- **Todo Model**: เชื่อมต่อกับ database และจัดการข้อมูล Todo

มีการทดสอบทั้งฟังก์ชันปกติ, error handling, และ logic ที่เกี่ยวกับวันเวลา

---

## โครงสร้างโปรเจกต์

```
Challenge-Comparison.md         # วิเคราะห์ความแตกต่างของแต่ละ challenge
Jest-Error-Analysis.md          # วิเคราะห์ error และการทำงานของ Jest
jest.config.js                  # config Jest
package.json                    # ข้อมูล dependencies และ script
coverage/                       # รายงาน coverage
doc/                            # เอกสารและภาพประกอบ
src/                            # โค้ดหลัก
  config/database.js            # mock database
  models/Todo.js                # Todo model
  utils/businessRules.js        # business rules
  utils/dataProcessing.js       # data processing
  utils/validation.js           # validation
tests/                          # ชุดทดสอบ
  setup.js                      # setup Jest
  unit/                         # unit test
    businessRules.test.js
    dataProcessing.test.js
    Todo.test.js
    validation.test.js
    ...
```

---

## วิธีการติดตั้งและใช้งาน

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. รัน Unit Test:
   ```bash
   npm test
   ```
3. ดูรายงาน coverage:
   เปิดไฟล์ `coverage/lcov-report/index.html` ด้วย browser

---

## ตัวอย่างโค้ดและการทดสอบ

### ตัวอย่าง businessRules
```js
function canMarkAsDone(todo) {
  if (!todo) return false;
  if (todo.done) return false;
  return true;
}
```

### ตัวอย่าง test
```js
test('should allow marking pending todo as done', () => {
  const todo = { task: 'Test', done: false };
  expect(canMarkAsDone(todo)).toBe(true);
});
```

---

## ตัวอย่างผลการทดลอง


### ภาพตัวอย่าง Coverage Report
![Coverage Report](doc/coverage-result.png)
> ภาพนี้เป็นตัวอย่างรายงาน coverage ของโปรเจกต์

### ตัวอย่างผลการทดสอบ Jest


### ตัวอย่างผลการทดสอบ Jest
![ผลลัพธ์ Jest จริง](doc/jest-result.png)
> ภาพนี้เป็นผลลัพธ์จริงจากการรัน Jest test ในโปรเจกต์

---

## สรุป Challenge และการวิเคราะห์ Error

- ดูไฟล์ [Challenge-Comparison.md](Challenge-Comparison.md) เพื่อเปรียบเทียบการทดสอบแต่ละแบบ (mock, error, date logic)
- ดูไฟล์ [Jest-Error-Analysis.md](Jest-Error-Analysis.md) เพื่อวิเคราะห์ error และแนวทางแก้ไข

---

## รายงาน Coverage

โปรเจกต์นี้มี coverage สูงกว่า 97% ในทุกโมดูลหลัก (ดูรายละเอียดใน coverage/lcov-report/index.html)
- models: 97.22%
- utils: 99%
- branches, functions, lines: มากกว่า 96%

---

## ข้อแนะนำการเพิ่มภาพประกอบ

สามารถเพิ่ม screenshot ผลการทดลอง (เช่น coverage, terminal, Jest result) ในโฟลเดอร์ doc แล้วแก้ไข path ใน README.md ได้
ตัวอย่าง:
![ผลลัพธ์ Jest](doc/jest-result.png)

---

## ผู้จัดทำ
- ชื่อ-นามสกุล
- รหัสนักศึกษา

---

> หมายเหตุ: README นี้ครอบคลุมทั้งโครงสร้าง, วิธีใช้งาน, ตัวอย่างโค้ด, ตัวอย่าง test, ผลการทดลอง, วิเคราะห์ challenge และ error, พร้อมแนะนำการเพิ่มภาพประกอบ

## รายละเอียดโปรเจกต์

โปรเจกต์นี้เป็นการฝึกเขียน Unit Test ด้วย Jest สำหรับโมดูลต่าง ๆ เช่น businessRules, dataProcessing, validation และ Todo model โดยมีการจัดโครงสร้างไฟล์แยกเป็น src, tests, coverage และเอกสารประกอบ

## โครงสร้างโปรเจกต์

```
Challenge-Comparison.md
Jest-Error-Analysis.md
jest.config.js
package.json
coverage/
  lcov-report/
    index.html
    ...
doc/
src/
  config/
    database.js
  models/
    Todo.js
  utils/
    businessRules.js
    dataProcessing.js
    validation.js
tests/
  setup.js
  unit/
    businessRules.test.js
    dataProcessing.test.js
    Todo.test.js
    ...
```

## วิธีการติดตั้งและใช้งาน

1. ติดตั้ง dependencies:

```bash
npm install
```

2. รัน Unit Test:

```bash
npm test
```

3. ดูรายงาน coverage:

เปิดไฟล์ `coverage/lcov-report/index.html` ด้วย browser

## ตัวอย่างผลการทดลอง

### ภาพตัวอย่าง Coverage Report

![Coverage Report](coverage/lcov-report/index.html)

> ภาพนี้แสดงผลการทดสอบและ coverage ของโค้ดในโปรเจกต์

### ตัวอย่างผลการทดสอบ

![ตัวอย่างผล Jest](doc/jest-result.png)

> ภาพนี้แสดงผลลัพธ์การรัน Jest test

## ผู้จัดทำ

- นสย สุรเชษฐ์ เป็งคำ 
- รหัสนักศึกษา 68543210080-6


---

> หมายเหตุ: สามารถเพิ่มภาพ screenshot ผลการทดลองในโฟลเดอร์ doc แล้วแก้ไข path ใน README.md ได้
