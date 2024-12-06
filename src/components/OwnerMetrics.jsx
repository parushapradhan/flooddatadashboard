import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const OwnerMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalListings: 0,
    highRiskFloodZones: 0,
    rentedListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/ownerMetrics");

        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <Typography>Loading metrics...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total Listings
            </Typography>
            <Typography variant="h4">{metrics.totalListings}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              High-Risk Flood Zones
            </Typography>
            <Typography variant="h4">{metrics.highRiskFloodZones}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
               Listings for Rent
            </Typography>
            <Typography variant="h4">{metrics.rentedListings}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OwnerMetrics;
