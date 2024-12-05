//sql query structure
import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pool = await getMSSQLPool()
      const result = await pool.request().query('SELECT TOP 10 * FROM TestTable')
      res.status(200).json(result.recordset)
    } catch (error) {
      console.error('Database query failed:', error)
      res.status(500).json({ error: 'Database query failed' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
