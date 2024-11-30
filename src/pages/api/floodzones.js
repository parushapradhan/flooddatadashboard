
import getMSSQLPool from '#src/lib/db/getDBPool';

export default async function handler(req, res) {
  try {
    const pool = await getMSSQLPool();
    const result = await pool
      .request()
      .query('SELECT id, name, severity, coordinates FROM flood_zones');

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
