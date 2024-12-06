import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  try {
    const { minPrice, maxPrice, bedrooms, region } = req.query
    const pool = await getMSSQLPool()

    let query = `SELECT * FROM property_information WHERE 1=1`

    if (minPrice) query += ` AND price >= @minPrice`
    if (maxPrice) query += ` AND price <= @maxPrice`
    if (bedrooms) query += ` AND bedrooms = @bedrooms`
    if (region) query += ` AND region_name = @region`

    const request = pool.request()

    if (minPrice) request.input('minPrice', sql.Float, minPrice)
    if (maxPrice) request.input('maxPrice', sql.Float, maxPrice)
    if (bedrooms) request.input('bedrooms', sql.Int, bedrooms)
    if (region) request.input('region', sql.VarChar, region)

    const result = await request.query(query)

    res.status(200).json(result.recordset)
  } catch (err) {
    console.error('Error fetching properties:', err)
    res.status(500).json({ error: 'Failed to fetch properties.' })
  }
}
