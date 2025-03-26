const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const sql = require('mssql/msnodesqlv8');

const port = 3000;

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const config = {
  server: 'localhost', // Use 'localhost\\SQLEXPRESS' if using a named instance
  database: 'CoffeeShopDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true, // Windows Authentication
    trustServerCertificate: true, // For self-signed certificates
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Kết nối thành công!');
    const result = await pool.request().query('SELECT @@VERSION');
    console.log('SQL Server Version:', result.recordset[0]); // Test query
  } catch (err) {
    console.error('❌ Lỗi kết nối:', err);
  }
}

connectDB();

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});