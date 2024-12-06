import getMSSQLPool from '#src/lib/db/getDBPool';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
  // Parse cookies to extract token
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Establish database connection
    const pool = await getMSSQLPool();

    // Fetch total listings owned by the user
    const totalListingsResult = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT COUNT(*) AS totalListings
        FROM dbo.Property_Information
        WHERE owner_id = @userId
      `);

    // Fetch high-risk flood zones owned by the user
    const highRiskFloodZonesResult = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT COUNT(*) AS highRiskFloodZones
        FROM dbo.Property_Information
        WHERE owner_id = @userId AND current_flood_risk = 'High'
      `);

    // Fetch rented listings owned by the user
    const rentedListingsResult = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT COUNT(*) AS rentedListings
        FROM dbo.Property_Information
        WHERE owner_id = @userId AND is_rental = 1
      `);

    // Combine results
    const metrics = {
      totalListings: totalListingsResult.recordset[0].totalListings,
      highRiskFloodZones: highRiskFloodZonesResult.recordset[0].highRiskFloodZones,
      rentedListings: rentedListingsResult.recordset[0].rentedListings,
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching property metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
