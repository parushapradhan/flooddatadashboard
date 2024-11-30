import bcrypt from 'bcrypt';
import getMSSQLPool from '#src/lib/db/getDBPool';
import sql from 'mssql';

export default async function handler(req, res) {


  const { email, password } = req.body;
  const username = 'test'
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the reusable connection pool
    const pool = await getMSSQLPool();

    // Insert user into the database
    await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password_hash', sql.NVarChar, hashedPassword)
      .query(
        'INSERT INTO users (username, email, password_hash) VALUES (@username, @email, @password_hash)'
      );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'User already exists or an unexpected error occurred.' });
  }
}
