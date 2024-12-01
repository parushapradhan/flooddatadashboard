import getMSSQLPool from '#src/lib/db/getDBPool';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    property_id,
    listing_date,
    price,
    rental_or_sale,
    flood_risk_disclosed,
    bedrooms,
    bathrooms,
    square_feet,
    image_url,
  } = req.body;

  if (
    !property_id ||
    !listing_date ||
    !price ||
    !rental_or_sale ||
    bedrooms === undefined ||
    bathrooms === undefined ||
    !square_feet
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getMSSQLPool();

    const query = `
      INSERT INTO Real_Estate_Listing (
        property_id,
        listing_date,
        price,
        rental_or_sale,
        flood_risk_disclosed,
        bedrooms,
        bathrooms,
        square_feet,
        image_url
      )
      VALUES (
        @property_id,
        @listing_date,
        @price,
        @rental_or_sale,
        @flood_risk_disclosed,
        @bedrooms,
        @bathrooms,
        @square_feet,
        @image_url
      );
    `;

    await pool
      .request()
      .input('property_id', sql.Int, property_id)
      .input('listing_date', sql.Date, listing_date)
      .input('price', sql.Float, price)
      .input('rental_or_sale', sql.VarChar(10), rental_or_sale)
      .input('flood_risk_disclosed', sql.Bit, flood_risk_disclosed)
      .input('bedrooms', sql.Int, bedrooms)
      .input('bathrooms', sql.Int, bathrooms)
      .input('square_feet', sql.Float, square_feet)
      .input('image_url', sql.VarChar(255), image_url)
      .query(query);

    res.status(200).json({ message: 'Listing added successfully' });
  } catch (error) {
    console.error('Error adding listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
