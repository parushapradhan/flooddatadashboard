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
import useMapContext from '../useMapContext'

const ClimateData = () => {
  const { district } = useMapContext();
  const [climateData, setClimateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // Extract unique years and sort them in descending order
        const uniqueYears = [...new Set(data.map((item) => item.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);

        // Set the default selected year to the latest year
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
          const latestYearData = data.filter((item) => item.year === uniqueYears[0]);
          setFilteredData(latestYearData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClimateData();
  }, [district]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    const yearData = climateData.filter((item) => item.year === year);
    setFilteredData(yearData);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 2,
        height: 300,
        overflowY: 'auto',
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        Climate Data for {district}
      </Typography>

      {/* Year Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
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
      {!loading && !error && filteredData.length > 0 && (
        <TableContainer  sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Avg Rainfall (mm)</TableCell>
                <TableCell>Max Rainfall (mm)</TableCell>
                <TableCell>Temperature (°C)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.climate_id}>
                  <TableCell>{row.average_rainfall_mm}</TableCell>
                  <TableCell>{row.max_rainfall_mm}</TableCell>
                  <TableCell>{row.temperature_c}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Data */}
      {!loading && !error && filteredData.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No climate data available for {selectedYear} in {district}.
        </Typography>
      )}
    </Box>
  );
};

export default ClimateData;
