import sql from 'mssql';
import getMSSQLPool from '#src/lib/db/getDBPool';

export default async function handler(req, res) {
  const { propertyId } = req.query;

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    const pool = await getMSSQLPool();

    const query = `
      SELECT
        property_id,
        address,
        region_name,
        price,
        bedrooms,
        bathrooms,
        current_flood_risk,
        square_feet,
        rental_or_sale,
        number_of_complaints,
        image_url
      FROM Property_Information
      WHERE property_id = @propertyId;
    `;

    const result = await pool.request()
      .input('propertyId', sql.Int, propertyId)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
