function calculateFloodRisk(climate, drainage, history) {
  // Climate Risk
  const CR = (
    climate.averageRainfall / 2000 + climate.maxRainfall / 500
  ) / 2; // Normalize

  // Infrastructure Risk
  const statusScore = {
    Good: 1.0,
    Average: 0.5,
    Poor: 0.2,
  }[drainage.status];

  const IR = 1 - (drainage.capacityCubicM * statusScore) / (1000 * 1.0);

  // Flood History Risk
  const FHR =
    (history.floodFrequency / 10 +
      history.floodSeverityScore * 0.5 +
      history.recentFloods / history.floodFrequency) /
    3; // Normalize

  // Weights
  const alpha = 0.4;
  const beta = 0.3;
  const gamma = 0.3;

  // Calculate Flood Risk
  const floodRisk = alpha * CR + beta * IR + gamma * FHR;

  return floodRisk;
}
