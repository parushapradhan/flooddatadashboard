import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

interface Property {
  property_id: number
  address: string
  region_name: string
  price: number
  bedrooms: number
  bathrooms: number
  current_flood_risk: string
  image_url: string
}

const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    region: '',
  })

  useEffect(() => {
    fetchProperties()
    fetchRegions()
  }, [])

  const fetchProperties = async () => {
    try {
      const query = new URLSearchParams(filters).toString() // Convert filters to query string
      const response = await fetch(`/api/properties?${query}`)
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchRegions = async () => {
    try {
      const response = await fetch(`/api/regions`)
      const data = await response.json()
      setRegions(data || [])
    } catch (error) {
      console.error('Error fetching regions:', error)
      setRegions([])
    }
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFilters(prevFilters => ({
      ...prevFilters,
      [name as string]: value,
    }))
  }

  const applyFilters = () => {
    fetchProperties() // Fetch properties based on updated filters
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Properties
      </Typography>

      {/* Filters Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Min Price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Max Price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel id="region-select-label">Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                name="region"
                value={filters.region}
                onChange={handleDropdownChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200, // Limit dropdown height for better usability
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {Array.isArray(regions) &&
                  regions.map((region, index) => (
                    <MenuItem
                      key={index}
                      value={region}
                      sx={{
                        typography: 'body1', // Consistent typography
                        padding: '8px 16px', // Better padding for options
                        '&:hover': {
                          backgroundColor: '#f5f5f5', // Subtle hover effect
                        },
                      }}
                    >
                      {region}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Box>

      {/* Properties Display Section */}
      <Grid container spacing={4}>
        {properties.length > 0 ? (
          properties.map(property => (
            <Grid item xs={12} md={4} key={property.property_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image_url || 'https://via.placeholder.com/400x300'}
                  alt={property.address}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {property.region_name}
                  </Typography>
                  <Typography variant="body1">{property.address}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.bedrooms} Bedrooms • {property.bathrooms} Bathrooms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Flood Risk: {property.current_flood_risk}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${property.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: 2 }}
                    onClick={() => (window.location.href = `/property/${property.property_id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No properties found.</Typography>
        )}
      </Grid>
    </Box>
  )
}

export default PropertyPage
