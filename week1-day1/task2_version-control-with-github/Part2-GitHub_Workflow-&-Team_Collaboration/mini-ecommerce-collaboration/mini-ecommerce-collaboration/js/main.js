// รอให้หน้าเว็บโหลดเสร็จสิ้นทั้งหมดก่อนรันโค้ด
document.addEventListener('DOMContentLoaded', () => {
    // อ้างอิงถึง HTML elements ที่จะใช้งาน
    const productList = document.getElementById('product-list');  // ส่วนที่แสดงรายการสินค้า
    const searchInput = document.getElementById('searchInput');  // ช่องค้นหาสินค้า
    const loader = document.getElementById('loader');  // ตัวแสดงสถานะกำลังโหลด
    
    // ตัวแปรเก็บข้อมูลสินค้าทั้งหมดเพื่อใช้ในการค้นหา
    let allProducts = [];

    // 1. แสดง Loader ทันทีก่อนเริ่ม Fetch ข้อมูล
    loader.style.display = 'block';

    // ดึงข้อมูลสินค้าจากไฟล์ JSON
    fetch('js/products.json')
        .then(response => {
            // ตรวจสอบว่าการเชื่อมต่อสำเร็จหรือไม่
            if (!response.ok) throw new Error('Network error');
            return response.json();  // แปลงข้อมูลจาก JSON format
        })
        .then(data => {
            // เมื่อได้ข้อมูลแล้ว เก็บไว้ในตัวแปรและแสดงผล
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(error => {
            // กรณีเกิดข้อผิดพลาดในการโหลดข้อมูล
            console.error('Error:', error);
            loader.textContent = 'ไม่สามารถโหลดข้อมูลได้';
        })
        .finally(() => {
            // 2. ซ่อน Loader เมื่อ fetch เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือ error)
            loader.style.display = 'none';
        });

    /**
     * ฟังก์ชันสำหรับแสดงรายการสินค้า
     * @param {Array} products - อาร์เรย์ของสินค้าที่ต้องการแสดง
     */
    function displayProducts(products) {
        // ล้างรายการสินค้าเดิมออก
        productList.innerHTML = '';
        
        // ถ้าไม่มีสินค้าให้แสดง แจ้งเตือนผู้ใช้
        if (products.length === 0) {
            productList.innerHTML = '<p>ไม่พบสินค้าที่ค้นหา</p>';
            return;
        }

        // วนลูปสร้างการ์ดสินค้าแต่ละตัว
        products.forEach(product => {
            // สร้าง element div สำหรับการ์ดสินค้า
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // กำหนด HTML ภายในการ์ด (รูปภาพ, ชื่อ, ราคา)
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>ราคา: ${product.price} บาท</p>
            `;
            
            // เพิ่มการ์ดเข้าไปในรายการสินค้า
            productList.appendChild(card);
        });
    }

    /**
     * ระบบค้นหาสินค้า
     * ฟังการพิมพ์ในช่องค้นหาและกรองสินค้าตามคำที่พิมพ์
     */
    searchInput.addEventListener('keyup', () => {
        // เอาค่าที่พิมพ์ในช่องค้นหามาแปลงเป็นตัวพิมพ์เล็กและตัดช่องวางด้านหน้า/หลังออก
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // ถ้าไม่มีคำค้นหา ให้แสดงสินค้าทั้งหมด
        if (searchTerm === '') {
            displayProducts(allProducts);
            return;
        }
        
        // กรองสินค้าที่มีชื่อตรงกับคำค้นหา
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm);
        });
        
        // แสดงสินค้าที่กรองได้
        displayProducts(filteredProducts);
    });
});