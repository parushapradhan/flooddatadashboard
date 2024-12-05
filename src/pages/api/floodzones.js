import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use encryption for Azure SQL or similar services
    trustServerCertificate: false, // Change to true if using self-signed certificates
  },
}

export default async function handler(req, res) {
  try {
    const { district } = req.body // Get district name from the query string

    if (!district) {
      return res.status(400).json({ error: 'District name is required' })
    }

    // const pool = await getMSSQLPool();
    let pool = new sql.ConnectionPool(config)
    await pool.connect()

    const result = await pool
      .request()
      .input('district', district)
      .query(
        `
        SELECT f.id, f.name, f.severity, f.coordinates
        FROM flood_zones f
        INNER JOIN District d ON f.district_id = d.district_id
        WHERE d.district_name = @district
        `,
      )

    const features = result.recordset.map(row => ({
      type: 'Feature',
      properties: {
        name: row.name,
        severity: row.severity,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [JSON.parse(row.coordinates)], // Parse the JSON coordinates
      },
    }))

    res.status(200).json({
      type: 'FeatureCollection',
      features,
    })
  } catch (err) {
    console.error('Error fetching flood zones:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
