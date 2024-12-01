import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const ClimateData = () => {
  const [district, setDistrict] = useState('Kathmandu'); // Default district
  const [climateData, setClimateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = [
    'Kathmandu',
    'Pokhara',
    'Biratnagar',
    'Lalitpur',
    'Bhaktapur',
    // Add more districts here
  ];

  useEffect(() => {
    const fetchClimateData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getClimateData?district=${district}`);
        if (!response.ok) {
          throw new Error('Failed to fetch climate data');
        }
        const data = await response.json();
        setClimateData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClimateData();
  }, [district]);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Climate Data for {district}
      </Typography>

      {/* District Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="district-select-label">Select District</InputLabel>
        <Select
          labelId="district-select-label"
          value={district}
          onChange={handleDistrictChange}
        >
          {districts.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {/* Climate Data Table */}
      {!loading && !error && climateData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Avg Rainfall (mm)</TableCell>
                <TableCell>Max Rainfall (mm)</TableCell>
                <TableCell>Temperature (°C)</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {climateData.map((row) => (
                <TableRow key={row.climate_id}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.average_rainfall_mm}</TableCell>
                  <TableCell>{row.max_rainfall_mm}</TableCell>
                  <TableCell>{row.temperature_c}</TableCell>
                  <TableCell>{row.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Data */}
      {!loading && !error && climateData.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No climate data available for {district}.
        </Typography>
      )}
    </Box>
  );
};

export default ClimateData;
