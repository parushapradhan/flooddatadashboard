import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool' // Replace with your DB connection function

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // const { district } = req.query;
  const district = 'Kathmandu'

  if (!district) {
    return res.status(400).json({ error: 'District is required' })
  }

  try {
    const pool = await getMSSQLPool()

    const query = `
      SELECT
        property_id,
        address,
        position,
        current_flood_risk,
        bedrooms,
        bathrooms,
        square_feet,
        image_url,
        owner_id,
        district_id
      FROM Property_Information
      WHERE district_id = (
        SELECT district_id
        FROM District
        WHERE district_name = @district
      );
    `

    const result = await pool.request().input('district', sql.VarChar(255), district).query(query)
    res.status(200).json(result.recordset)
  } catch (error) {
    console.error('Error fetching property data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
