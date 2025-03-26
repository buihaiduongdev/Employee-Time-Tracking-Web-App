const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'CoffeeShopDB',         // Tên database của bạn
    options: {
    encrypt: true,                  // Bật SSL
    trustServerCertificate: true     // Bỏ qua chứng chỉ
  }
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("✅ Kết nối SQL Server thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối SQL Server:", err);
  }
}

connectDB();

module.exports = sql;
