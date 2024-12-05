import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

// API to get both property and real estate listings
export default async function handler(req, res) {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const pool = await getMSSQLPool()
    // Query to fetch property and real estate listing data
    const query = `
      SELECT
        p.property_id,
        p.address,
        p.position,
        p.number_of_complaints,
        p.owner_id,
        p.is_rental,
        p.last_updated,
        p.current_flood_risk,
        p.listing_date,
        p.price,
        p.rental_or_sale,
        p.flood_risk_disclosed,
        p.bedrooms,
        p.bathrooms,
        p.square_feet,
        p.image_url
      FROM Property_Information p
      WHERE p.owner_id = @userId;
    `

    const result = await pool
      .request()
      .input('userId', sql.Int, userId) // Use parameterized query for safety
      .query(query)
    console.log(result)
    res.status(200).json(result.recordset) // Send results as JSON
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
