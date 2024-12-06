import bcrypt from 'bcrypt'
import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  const { name, email, password, phone, dob, role } = req.body

  if (!name || !email || !password || !phone || !dob || !role) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Get the reusable connection pool
    const pool = await getMSSQLPool()

    // Insert the user into the User_Information table and get the inserted user_id
    const userInsertResult = await pool
      .request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('phone_number', sql.NVarChar, phone)
      .input('created_at', sql.DateTime, new Date()) // Insert current date for created_at
      .input('dob', sql.Int, dob)
      .query(
        `INSERT INTO User_Information (name, email, password, phone_number, created_at, dob)
         OUTPUT INSERTED.user_id
         VALUES (@name, @email, @password, @phone_number, @created_at, @dob)`,
      )

    const userId = userInsertResult.recordset[0].user_id

    // Get the role_id from the Role table using the role_name
    const roleResult = await pool
      .request()
      .input('role_name', sql.NVarChar, role)
      .query(
        `SELECT role_id
         FROM Role
         WHERE role_name = @role_name`,
      )

    if (!roleResult.recordset.length) {
      return res.status(400).json({ error: 'Invalid role name provided.' })
    }

    const roleId = roleResult.recordset[0].role_id

    // Insert the user_id and role_id into the User_Role table
    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('role_id', sql.Int, roleId)
      .query(
        `INSERT INTO User_Role (user_id, role_id)
         VALUES (@user_id, @role_id)`,
      )

    res.status(201).json({ message: 'User registered successfully with role assigned!' })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}
