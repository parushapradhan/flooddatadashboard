const sql = require('mssql');

// MSSQL configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 1433, // Default MSSQL port
  options: {
    encrypt: true, // Use encryption for data (recommended for Azure SQL)
    trustServerCertificate: true, // If using self-signed certificates
  },
  pool: {
    max: 10, // Max number of connections in the pool
    min: 1,  // Min number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
};

// Initialize MSSQL connection pool
let pool;

async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to MSSQL');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
  return pool;
}

module.exports = { getConnection, sql };
