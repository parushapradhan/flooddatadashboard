import jwt from 'jsonwebtoken'
import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Missing or malformed authorization header')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET)



    // Connect to the database
    const pool = await getMSSQLPool()

    const query = `
      SELECT notification_id, property_id, user_id, message, created_at, is_read
      FROM Notifications
      WHERE user_id = @user_id
      ORDER BY created_at DESC;
    `

    const result = await pool
      .request()
      .input('user_id', sql.Int, decoded.userId) // Use userId from the token
      .query(query)

    const notifications = result.recordset

    res.status(200).json({ notifications })
  } catch (err) {
    console.error('Error fetching notifications:', err)

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }

    if (err.code === 'ECONNCLOSED') {
      return res.status(500).json({ error: 'Database connection error' })
    }

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
