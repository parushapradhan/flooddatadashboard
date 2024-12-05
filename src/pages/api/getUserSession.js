import jwt from 'jsonwebtoken'
import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export default async function handler(req, res) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Missing or malformed authorization header')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Decode and validate the JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    console.log('Decoded token:', decoded)

    // Connect to the database
    const pool = await getMSSQLPool()

    // Fetch user session information
    const result = await pool
      .request()
      .input('userId', sql.Int, decoded.userId)
      .query('SELECT user_id, name, email FROM User_Information WHERE user_id = @userId')

    if (!result.recordset.length) {
      console.error('User not found for ID:', decoded.userId)
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.recordset[0]
    console.log('User session retrieved:', user)

    return res.status(200).json({ user_id: user.user_id, name: user.name, email: user.email })
  } catch (err) {
    console.error('Error in getUserSession handler:', err)

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }

    if (err.code === 'ECONNCLOSED') {
      console.error('Database connection is closed')
      return res.status(500).json({ error: 'Database connection error' })
    }

    return res.status(401).json({ error: 'Invalid token' })
  }
}
