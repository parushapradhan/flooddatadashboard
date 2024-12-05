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
        l.listing_id,
        l.listing_date,
        l.price,
        l.rental_or_sale,
        l.flood_risk_disclosed,
        l.bedrooms,
        l.bathrooms,
        l.square_feet,
        l.image_url
      FROM Property_Information p
      LEFT JOIN Real_Estate_Listing l ON p.property_id = l.property_id
      WHERE p.owner_id = @userId;
    `

    const result = await pool
      .request()
      .input('userId', sql.Int, userId) // Use parameterized query for safety
      .query(query)

    res.status(200).json(result.recordset) // Send results as JSON
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
