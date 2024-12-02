import jwt from 'jsonwebtoken';
import sql from 'mssql';
import getMSSQLPool from '#src/lib/db/getDBPool';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    console.log('Starting login process...');
    const trimmedEmail = email.trim();
    console.log('Email provided:', trimmedEmail);

    // Database connection
    const pool = await getMSSQLPool();
    console.log('Database connection established.');

    // Fetch user from User_Information table
    const result = await pool
      .request()
      .input('email', sql.NVarChar, trimmedEmail)
      .query(`
        SELECT user_id, name, email, password 
        FROM User_Information 
        WHERE email = @email
      `);

    console.log('Query result:', result.recordset);

    // Check if user exists
    const user = result.recordset[0];
    if (!user) {
      console.error('No user found for email:', trimmedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Password validation
    console.log('Password provided:', password);
    console.log('Password in database:', user.password);
    if (password !== user.password) {
      console.error('Password mismatch for user:', user.email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User authenticated successfully:', user);

    // Generate JWT token
    const expiresIn = '1h';
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn }
    );

    // Generate session details
    const sessionId = Math.floor(Date.now() / 1000); // Use seconds since epoch for session_id
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    console.log('Preparing to insert session with session_id:', sessionId, 'expires_at:', expiresAt);

    // Insert session into the Session table
    const sessionInsertResult = await pool
      .request()
      .input('session_id', sql.Int, sessionId)
      .input('user_id', sql.Int, user.user_id)
      .input('expires_at', sql.DateTime, expiresAt)
      .query(`
        INSERT INTO Session (session_id, user_id, expires_at)
        VALUES (@session_id, @user_id, @expires_at)
      `);

    console.log('Session inserted successfully:', sessionInsertResult);

    // Set auth_token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=3600;${
        isProduction ? ' Secure; SameSite=Strict;' : ''
      }`
    );

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login process:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
