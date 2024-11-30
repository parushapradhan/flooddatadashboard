import bcrypt from 'bcrypt';
import getMSSQLPool from '#src/lib/db/getDBPool';
import sql from 'mssql';

export default async function handler(req, res) {
  const { name, email, password, phone_number, year } = req.body;

  if (!name || !email || !password || !phone_number) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the reusable connection pool
    const pool = await getMSSQLPool();

    // Insert user into the User_Information table
    await pool
      .request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('phone_number', sql.NVarChar, phone_number)
      .input('created_at', sql.DateTime, new Date()) // Insert current date for created_at
      .query(
        `INSERT INTO User_Information (name, email, password, phone_number, created_at)
         VALUES (@name, @email, @password, @phone_number, @created_at, @year)`
      );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'User already exists or an unexpected error occurred.' });
  }
}
