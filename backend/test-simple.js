require('dotenv').config();
const { pool } = require('./config/database');

async function testSimple() {
  try {
    console.log('🔍 Probando conexión simple...');
    console.log('Variables de entorno:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NO SET');
    
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query de prueba exitosa:', rows);
    
    connection.release();
    console.log('🎉 Todo funciona correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testSimple();
