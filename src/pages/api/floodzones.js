
import getMSSQLPool from '#src/lib/db/getDBPool';

export default async function handler(req, res) {
  try {
    // const { district } = req.query; // Get district name from the query string
    //TODO Replace the static district


    const district = "Kathmandu"

    if (!district) {
      return res.status(400).json({ error: 'District name is required' });
    }

    const pool = await getMSSQLPool();
    const result = await pool
      .request()
      .input('district', district)
      .query(
        `
        SELECT f.id, f.name, f.severity, f.coordinates
        FROM flood_zones f

        `
      )
      // INNER JOIN district d ON f.district_id = d.district_id
      // WHERE d.district = @district
    const features = result.recordset.map(row => ({
      type: 'Feature',
      properties: {
        name: row.name,
        severity: row.severity,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [JSON.parse(row.coordinates)], // Parse the JSON coordinates
      },
    }));

    res.status(200).json({
      type: 'FeatureCollection',
      features,
    });
  } catch (err) {
    console.error('Error fetching flood zones:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
