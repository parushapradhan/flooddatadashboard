import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false, // Set to true if using self-signed certificates
  },
  pool: {
    max: 10, // Maximum number of connections
    min: 0, // Minimum number of connections
    idleTimeoutMillis: 30000, // Idle timeout before closing
  },
}
const pool = new sql.ConnectionPool(config);

export default pool
