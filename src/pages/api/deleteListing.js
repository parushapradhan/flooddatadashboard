import getMSSQLPool from '#src/lib/db/getDBPool';
import sql from 'mssql'

import getMSSQLPool from '#src/lib/db/getDBPool';
// API to delete a listing
export default async function handler(req, res)  {
  const { propertyId } = req.body;

  // Validate the request body
  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    const pool = await getMSSQLPool();

    // Query to delete the listing by property_id
    const deleteQuery = `
      DELETE FROM Real_Estate_Listing
      WHERE property_id = @propertyId;
    `;

    const result = await pool
      .request()
      .input('propertyId', sql.Int, propertyId)
      .query(deleteQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server (if not already running elsewhere)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
