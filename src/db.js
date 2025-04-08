// db.js
const sql = require('mssql/msnodesqlv8');

// Cấu hình kết nối database
const config = {
  driver: 'msnodesqlv8',
  connectionString: 'DSN=abc;Database=CoffeeShopDB;',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

// Hàm kết nối database
async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('Kết nối thành công!');
    return pool;
  } catch (err) {
    console.error('Lỗi kết nối:', err);
    throw err; // Ném lỗi để xử lý ở nơi gọi
  }
}

async function getClockInDB(EmployeeID = null) {
  const pool = await connectDB();
  try {
    let queryStr = 'SELECT * FROM ClockIn';
    let request = pool.request(); // Tạo request

    if (EmployeeID !== null) {
      queryStr += ' WHERE EmployeeID = @EmployeeID';
      request = request.input('EmployeeID', sql.Int, EmployeeID); // Gán tham số cho request
    }
    queryStr += ' ORDER BY CAST(ClockInTime AS DATE) DESC, ClockInTime DESC';
    const result = await request.query(queryStr); // Sử dụng request để thực thi truy vấn
    console.log('Bản ghi chấm công:', result.recordset);
    return result.recordset;
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    throw err;
  } finally {
    await pool.close();
  }
}

async function clockIn(employeeID) {
  const pool = await connectDB();
  try {
    const result = await pool.request()
      .input('EmployeeID', sql.Int, employeeID)
      .input('ClockInTime', sql.VarChar, new Date().toISOString()) // ISO 8601 format
      .query('INSERT INTO ClockIn (EmployeeID, ClockInTime) VALUES (@EmployeeID, @ClockInTime)');
    console.log('Chấm công thành công cho nhân viên:', employeeID);
    return result;
  } catch (err) {
    console.error('❌ Lỗi khi chấm công:', err);
    throw err;
  } finally {
    await pool.close();
  }
}
// Xuất các hàm để sử dụng ở file khác
module.exports = {
  connectDB,
  getClockInDB,
  clockIn
};