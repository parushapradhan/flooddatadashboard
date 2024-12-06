import getMSSQLPool from '#src/lib/db/getDBPool';
import sql from 'mssql';
import calculateFloodRisk from '#src/lib/helper/calculateFloodRisk'; // Import your risk calculation function
import { parse } from 'cookie';
import jwt from 'jsonwebtoken'

function generateRandomId() {
  return Math.floor(Math.random() * 1000000); // Generates a random integer between 0 and 999999
}

// API to fetch and update flood risk based on property ID
export default async function handler(req, res) {
  const { propertyId } = req.body;
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  // Validate the request body
  if (!propertyId || !userId) {
    return res.status(400).json({ error: 'Property ID and User ID are required' });
  }

  try {
    const pool = await getMSSQLPool();

    // Query to fetch required data for flood risk calculation
    const fetchQuery = `
      SELECT
        d.district_id,
        g.elevation,
        g.slope,
        g.distance_to_water,
        h.river_flow_rate,
        h.rainfall_runoff,
        h.groundwater_level,
        h.drainage_efficiency,
        m.rainfall_intensity,
        m.storm_frequency,
        i.urbanization_rate,
        i.drainage_capacity
      FROM Property_Information p
      JOIN District d ON p.district_id = d.district_id
      JOIN GeographicData g ON d.district_id = g.district_id
      JOIN HydrologicalData h ON d.district_id = h.district_id
      JOIN MeteorologicalData m ON d.district_id = m.district_id
      JOIN InfrastructureData i ON d.district_id = i.district_id
      WHERE p.property_id = @propertyId;
    `;

    const result = await pool
      .request()
      .input('propertyId', sql.Int, propertyId)
      .query(fetchQuery);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const floodData = result.recordset[0];

    // Calculate flood risk using the imported function
    const floodRisk = calculateFloodRisk({
      elevation: floodData.elevation,
      maxElevation: 2000, // Example max values; adjust as needed
      slope: floodData.slope,
      maxSlope: 30,
      distanceToWater: floodData.distance_to_water,
      maxDistanceToWater: 20,
      riverFlowRate: floodData.river_flow_rate,
      maxRiverFlowRate: 500,
      rainfallRunoff: floodData.rainfall_runoff,
      maxRainfallRunoff: 100,
      groundwaterLevel: floodData.groundwater_level,
      maxGroundwaterLevel: 50,
      rainfallIntensity: floodData.rainfall_intensity,
      maxRainfallIntensity: 150,
      stormFrequency: floodData.storm_frequency,
      maxStormFrequency: 10,
      urbanizationRate: floodData.urbanization_rate,
      maxUrbanizationRate: 100,
      drainageCapacity: floodData.drainage_capacity,
      maxDrainageCapacity: 100,
    });

    // Query to update the flood risk in the Flood_Risk_Details table
    const insertQuery = `
    INSERT INTO Flood_Risk_Details
    (risk_id, property_id, historical_floods, insurance_required, predicted_risk_score, year, source)
    VALUES (@riskId, @propertyId, @historicalFloods, @insuranceRequired, @riskScore, YEAR(GETDATE()), 'Calculated API');
  `;

  await pool
    .request()
    .input('riskID',sql.Int,generateRandomId())
    .input('propertyId', sql.Int, propertyId)
    .input('historicalFloods', sql.Int, floodData.historical_floods || 0) // Default to 0 if historical floods are not available
    .input('insuranceRequired', sql.Bit, floodRisk.riskLevel === 'High' ? 1 : 0) // Example logic for insurance
    .input('riskScore', sql.Float, floodRisk.floodRiskScore)
    .query(insertQuery);

      const notificationId = generateRandomId();
    // Insert a notification into the Notifications table
    const notificationQuery = `
      INSERT INTO Notifications (notification_id, property_id, user_id, message, created_at, is_read)
      VALUES (@notification_id, @propertyId, @userId, @message, GETDATE(), 0);
    `;

    const notificationMessage = `Flood risk has been calculated for your property (ID: ${propertyId}). Risk Level: ${floodRisk.riskLevel}.`;
    await pool
      .request()
      .input('notification_id', sql.Int, notificationId)
      .input('propertyId', sql.Int, propertyId)
      .input('userId', sql.Int, userId)
      .input('message', sql.Text, notificationMessage)
      .query(notificationQuery);

    res.status(200).json({
      message: 'Flood risk calculated, updated, and notification sent successfully',
      floodRisk,
    });
  } catch (err) {
    console.error('Error calculating or updating flood risk:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
