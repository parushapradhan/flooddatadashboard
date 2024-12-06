import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool' // Ensure this points to your DB connection utility

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get the district name from the query parameter
  const { district } = req.query

  if (!district) {
    return res.status(400).json({ error: 'District is required.' })
  }

  try {
    // Establish a database connection
    const pool = await getMSSQLPool()

    // Query for climate data based on the district
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

    // If no data is found, return an empty array
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No climate data found for the specified district.' })
    }

    // Return the climate data
    res.status(200).json(result.recordset)
  } catch (error) {
    console.error('Error fetching climate data:', error)
    res.status(500).json({ error: 'Internal Server Error.' })
  }
}

