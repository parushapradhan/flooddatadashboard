import jwt from 'jsonwebtoken'
import sql from 'mssql'

import dbConfig from '../../config/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.cookies.auth_token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET)

    const pool = await sql.connect(dbConfig)
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT username, email FROM users WHERE user_id = @userId')

    const user = result.recordset[0]
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    console.error('Profile error:', err)
    res.status(401).json({ error: 'Invalid token' })
  }
}
