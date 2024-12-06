import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool' // Replace with your DB connection function
import pool from '#src/lib/db/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { district } = req.query
  // const district = 'Kathmandu'

  if (!district) {
    return res.status(400).json({ error: 'District is required' })
  }

  try {
    if(!pool.connected || !pool.connecting) await pool.connect()
    const query = `
      SELECT
        climate_id,
        region_name,
        year,
        average_rainfall_mm,
        max_rainfall_mm,
        temperature_c,
        source
      FROM dbo.Climate_Data
      WHERE region_name = @district;
    `

    const result = await pool.request().input('district', sql.VarChar, district).query(query)

    res.status(200).json(result.recordset)
  } catch (error) {
    console.error('Error fetching climate data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
