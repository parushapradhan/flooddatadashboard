import sql from 'mssql'
import jwt from 'jsonwebtoken'
import getMSSQLPool from '#src/lib/db/getDBPool'
import { parse } from 'cookie';
export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    price,
    rental_or_sale,
    flood_risk_disclosed,
    district_name,
    bedrooms,
    bathrooms,
    square_feet,
    image_url,
    location,
    user_Id,
  } = req.body



  if (
    !price ||
    !rental_or_sale ||
    bedrooms === undefined ||
    bathrooms === undefined ||
    !district_name ||
    !square_feet ||
    !location
  ) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const pool = await getMSSQLPool()

    // Fetch district_id based on district_name
    const districtQuery = `
      SELECT district_id
      FROM District
      WHERE district_name = @district_name;
    `

    const districtResult = await pool
      .request()
      .input('district_name', sql.VarChar(255), district_name)
      .query(districtQuery)

    if (districtResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid district name' })
    }

    const district_id = districtResult.recordset[0].district_id

    // Fetch latitude and longitude using OpenStreetMap API
    const geolocationResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
    )

    if (!geolocationResponse.ok) {
      throw new Error('Failed to fetch geolocation data')
    }

    const geolocationData = await geolocationResponse.json()

    if (geolocationData.length === 0) {
      return res.status(400).json({ error: 'Invalid location' })
    }

    const { lat, lon } = geolocationData[0]
    const formattedPosition = `[${lat}, ${lon}]` // Format as [[lat, long]]

    const insertQuery = `
      INSERT INTO Property_Information (
        position,
        address,
        number_of_complaints,
        owner_id,
        is_rental,
       last_updated,
       current_flood_risk,
       region_name,
       district_id,
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
        @position,
        @address,
        @number_of_complaints,
        @owner_id,
        @is_rental,
       @last_updated,
       @current_flood_risk,
       @region_name,
       @district_id,
       @listing_date,
       @price,
       @rental_or_sale,
       @flood_risk_disclosed,
       @bedrooms,
       @bathrooms,
       @square_feet,
       @image_url
      );
    `

    await pool
      .request()
      .input('price', sql.Float, price)
      .input('rental_or_sale', sql.VarChar(10), rental_or_sale)
      .input('is_rental', sql.Bit, rental_or_sale)
      .input('flood_risk_disclosed', sql.Bit, flood_risk_disclosed)
      .input('bedrooms', sql.Int, bedrooms)
      .input('bathrooms', sql.Int, bathrooms)
      .input('square_feet', sql.Float, square_feet)
      .input('image_url', sql.VarChar(255), image_url)
      .input('address', sql.VarChar(255), location)
      .input('district_id', sql.Int, district_id)
      .input('owner_id', sql.Int, userId)
      .input('position', sql.VarChar(255), formattedPosition)
      .input ('number_of_complaints',sql.Int,0)
      .input('last_updated',sql.Date, new Date())
      .input('current_flood_risk',sql.VarChar(255),'Unknown')
      .input('region_name',sql.VarChar(255),district_name) // Pass lat/long as position
      .input('listing_date',sql.Date, new Date())
      .query(insertQuery)

    res.status(200).json({ message: 'Listing added successfully'})
  } catch (error) {
    console.error('Error adding listing:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
