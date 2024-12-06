import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  try {
    const pool = await getMSSQLPool()
    const result = await pool.request().query(`SELECT DISTINCT region_name FROM property_information`)

    res.status(200).json(result.recordset.map(row => row.region_name))
  } catch (err) {
    console.error('Error fetching regions:', err)
    res.status(500).json({ error: 'Failed to fetch regions.' })
  }
}
