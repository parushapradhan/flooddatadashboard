import jwt from 'jsonwebtoken';
import sql from 'mssql';
import getMSSQLPool from '#src/lib/db/getDBPool'; // Update this with your actual DB pool utility

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const pool = await getMSSQLPool();
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT name, email FROM User_Information WHERE user_id = @userId');

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }

    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
