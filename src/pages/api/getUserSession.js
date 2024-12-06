import jwt from 'jsonwebtoken'
import sql from 'mssql'
import getMSSQLPool from '#src/lib/db/getDBPool'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'


export default async function handler(req, res) {
  const authHeader = req.headers.authorization


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]


  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    const pool = await getMSSQLPool()
    const result = await pool
      .request()
      .input('userId', sql.Int, decoded.userId)
      .query('SELECT user_id, name, email FROM User_Information WHERE user_id = @userId')
      .query('SELECT user_id, name, email FROM User_Information WHERE user_id = @userId')

    const user = result.recordset[0]

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ name: user.name, email: user.email })
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: 'Invalid token' })
  }
}
