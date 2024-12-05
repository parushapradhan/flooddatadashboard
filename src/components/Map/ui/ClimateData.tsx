import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import useMapContext from '../useMapContext'

// Define the type for climate data
interface ClimateDataItem {
  climate_id: number
  year: number
  average_rainfall_mm: number
  max_rainfall_mm: number
  temperature_c: number
}

const ClimateData: React.FC = () => {
  const { district } = useMapContext()
  const [climateData, setClimateData] = useState<ClimateDataItem[]>([])
  const [filteredData, setFilteredData] = useState<ClimateDataItem[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClimateData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/getClimateData?district=${district}`)
        if (!response.ok) {
          throw new Error('Failed to fetch climate data')
        }

        const data: ClimateDataItem[] = await response.json()
        setClimateData(data)

        // Extract unique years and sort them in descending order
        const uniqueYears = [...new Set(data.map(item => item.year))].sort((a, b) => b - a)
        setYears(uniqueYears)

        // Set the default selected year to the latest year
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0])
          const latestYearData = data.filter(item => item.year === uniqueYears[0])
          setFilteredData(latestYearData)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClimateData()
  }, [district])

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    const year = parseInt(event.target.value, 10)
    setSelectedYear(year)
    const yearData = climateData.filter(item => item.year === year)
    setFilteredData(yearData)
  }

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
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Climate Data for {district}
      </Typography>

      {/* Year Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select labelId="year-select-label" value={String(selectedYear)} onChange={handleYearChange}>
          {years.map(year => (
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
        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Avg Rainfall (mm)</TableCell>
                <TableCell>Max Rainfall (mm)</TableCell>
                <TableCell>Temperature (°C)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map(row => (
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
  )
}

export default ClimateData
