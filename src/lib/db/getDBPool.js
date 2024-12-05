import sql from 'mssql'

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

let pool = null

/**
 * Get or create a reusable MSSQL connection pool.
 */
async function getMSSQLPool() {
  try {
    if (!pool || !pool.connected) {
      // if (pool && !pool.connected) {
      //   console.log('Connection pool is closed. Reconnecting...')
      //   await pool.close()
      // }
      // console.log('Creating a new MSSQL connection pool...')
      pool = new sql.ConnectionPool(config)
      await pool.connect()
    }
    return pool
  } catch (error) {
    console.error('Error connecting to MSSQL:', error)
    pool = null // Reset pool to allow reconnection in the future
    throw error // Rethrow the error for further handling
  }
}

export default getMSSQLPool
