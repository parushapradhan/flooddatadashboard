import sql from 'mssql';
import getMSSQLPool from '#src/lib/db/getDBPool';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract the token from the Authorization header or cookies
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { userId } = decoded;

    console.log('User ID from token:', userId);

    // Connect to the database
    const pool = await getMSSQLPool();
    console.log('Database connection established.');

    // Delete the session for this user
    const deleteResult = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query(`
        DELETE FROM Session
        WHERE user_id = @user_id
      `);

    console.log('Session deleted:', deleteResult.rowsAffected);

    // Clear the auth_token cookie
    res.setHeader('Set-Cookie', `auth_token=; HttpOnly; Path=/; Max-Age=0;`);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout process:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
