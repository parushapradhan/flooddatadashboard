import jwt from 'jsonwebtoken';
import sql from 'mssql';
import getMSSQLPool from '#src/lib/db/getDBPool'; // Import your connection pool utility

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const pool = await getMSSQLPool();

    // Fetch user from database
    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT user_id, name, email, password FROM User_Information WHERE email = @email');

    const user = result.recordset[0];

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User fetched from DB:', user);

    // Compare the plain text password directly
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiry
    );

    // Set the token as an HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=3600;${
        isProduction ? ' Secure; SameSite=Strict;' : ''
      }`
    );

    // Respond with success
    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
