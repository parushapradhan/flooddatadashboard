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
};

let pool = null;

/**
 * Get or create a reusable MSSQL connection pool.
 */
async function getMSSQLPool() {
    if (!pool) {
        console.log('Creating a new MSSQL connection pool...');
        pool = new sql.ConnectionPool(config);
        await pool.connect();
    }
    return pool;
}

module.exports = getMSSQLPool;
