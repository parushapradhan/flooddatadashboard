import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  const pool = await getMSSQLPool()
  const { id, minPrice, maxPrice, bedrooms, region } = req.query

  try {
    let query = `
      SELECT
        property_id, address, region_name, price, bedrooms, bathrooms, 
        current_flood_risk, image_url
      FROM Property_Information
      WHERE 1=1
    `

    const request = pool.request()

    // Add filters
    if (id) {
      query += ' AND property_id = @id'
      request.input('id', sql.Int, id)
    }
    if (minPrice) {
      query += ' AND price >= @minPrice'
      request.input('minPrice', sql.Int, minPrice)
    }
    if (maxPrice) {
      query += ' AND price <= @maxPrice'
      request.input('maxPrice', sql.Int, maxPrice)
    }
    if (bedrooms) {
      query += ' AND bedrooms = @bedrooms'
      request.input('bedrooms', sql.Int, bedrooms)
    }
    if (region) {
      query += ' AND region_name = @region'
      request.input('region', sql.VarChar, region)
    }

    const result = await request.query(query)

    res.status(200).json(id ? result.recordset[0] : result.recordset)
  } catch (error) {
    console.error('Error fetching properties:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
