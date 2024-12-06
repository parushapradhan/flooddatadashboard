import sql from 'mssql';

export const DB = new sql.ConnectionPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, // Use the hostname or IP address of your MSSQL server
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10), // Ensure the port is an integer
  options: {
    encrypt: true, // Set to true if using Azure or SSL connections
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true', // Enable for self-signed certificates
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0,  // Minimum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
});
