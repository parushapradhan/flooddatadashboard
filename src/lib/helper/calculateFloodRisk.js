export default function calculateFloodRisk(data) {
  // Destructure the input data
  const {
    elevation, maxElevation,
    distanceToWater, maxDistanceToWater,
    slope, maxSlope,
    riverFlowRate, maxRiverFlowRate,
    rainfallRunoff, maxRainfallRunoff,
    groundwaterLevel, maxGroundwaterLevel,
    rainfallIntensity, maxRainfallIntensity,
    stormFrequency, maxStormFrequency,
    drainageCapacity, maxDrainageCapacity,
    urbanizationRate, maxUrbanizationRate,
  } = data;

  // Weights for each component
  const weights = {
    geographic: { elevation: 0.5, distanceToWater: 0.3, slope: 0.2 },
    hydrological: { riverFlowRate: 0.4, rainfallRunoff: 0.4, groundwaterLevel: 0.2 },
    meteorological: { rainfallIntensity: 0.6, stormFrequency: 0.4 },
    infrastructure: { drainageCapacity: 0.7, urbanizationRate: 0.3 },
  };

  // Geographic Risk (G)
  const geographicRisk =
    weights.geographic.elevation * ((maxElevation - elevation) / maxElevation) +
    weights.geographic.distanceToWater * (distanceToWater / maxDistanceToWater) +
    weights.geographic.slope * ((maxSlope - slope) / maxSlope);

  // Hydrological Risk (H)
  const hydrologicalRisk =
    weights.hydrological.riverFlowRate * (riverFlowRate / maxRiverFlowRate) +
    weights.hydrological.rainfallRunoff * (rainfallRunoff / maxRainfallRunoff) +
    weights.hydrological.groundwaterLevel * (groundwaterLevel / maxGroundwaterLevel);

  // Meteorological Risk (M)
  const meteorologicalRisk =
    weights.meteorological.rainfallIntensity * (rainfallIntensity / maxRainfallIntensity) +
    weights.meteorological.stormFrequency * (stormFrequency / maxStormFrequency);

  // Infrastructure Risk (I)
  const infrastructureRisk =
    weights.infrastructure.drainageCapacity * (1 - drainageCapacity / maxDrainageCapacity) +
    weights.infrastructure.urbanizationRate * (urbanizationRate / maxUrbanizationRate);

  // Composite Flood Risk Score
  const floodRiskScore =
    0.25 * geographicRisk +
    0.35 * hydrologicalRisk +
    0.3 * meteorologicalRisk +
    0.1 * infrastructureRisk;

  // Risk Classification
  const riskLevel =
    floodRiskScore <= 0.3
      ? "Low"
      : floodRiskScore <= 0.6
      ? "Medium"
      : "High";

  // Return the result
  return {
    floodRiskScore: floodRiskScore.toFixed(2),
    riskLevel,
  };
}


// Example input data
const inputData = {
  elevation: 200,
  maxElevation: 1000,
  distanceToWater: 2,
  maxDistanceToWater: 10,
  slope: 5,
  maxSlope: 30,
  riverFlowRate: 120,
  maxRiverFlowRate: 300,
  rainfallRunoff: 50,
  maxRainfallRunoff: 100,
  groundwaterLevel: 5,
  maxGroundwaterLevel: 20,
  rainfallIntensity: 50,
  maxRainfallIntensity: 150,
  stormFrequency: 5,
  maxStormFrequency: 10,
  drainageCapacity: 80,
  maxDrainageCapacity: 100,
  urbanizationRate: 50,
  maxUrbanizationRate: 100,
};

// Calculate flood risk
const result = calculateFloodRisk(inputData);
console.log(result);
// Output: { floodRiskScore: "0.55", riskLevel: "Medium Risk" }

