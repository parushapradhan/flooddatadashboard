import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { propertyId, name, email, message } = req.body

  if (!propertyId || !name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    const pool = await getMSSQLPool()

    // Fetch owner email from User_Information table using propertyId
    const ownerResult = await pool.request().input('propertyId', sql.Int, propertyId).query(`
        SELECT u.email AS owner_email, u.name AS owner_name
        FROM property_information p
        INNER JOIN User_Information u ON p.owner_id = u.user_id
        WHERE p.property_id = @propertyId
      `)

    const owner = ownerResult.recordset[0]

    if (!owner) {
      return res.status(404).json({ error: 'Property owner not found.' })
    }

    // Simulate sending an email to the owner
    console.log(`
      To: ${owner.owner_email}
      From: ${name} (${email})
      Message: ${message}
    `)

    // Respond with success
    res.status(200).json({ success: true, message: 'Email sent successfully.' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
