import DeleteIcon from '@mui/icons-material/Delete'
import OwnerMetrics from '#src/components/OwnerMetrics'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const PropertyListings = ({ userId }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter() // React Router's navigation hook

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/getUserListing')

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [userId])

  const handleDelete = async propertyId => {
    try {
      const response = await fetch(`/api/deleteListing`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete the listing')
      }

      // Remove the deleted item from the UI
      setData(prevData => prevData.filter(item => item.property_id !== propertyId))
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleCalculateFlood = async propertyId => {
    try {
      const response = await fetch(`/api/calculateFlood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate')
      }
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleAddListing = () => {
    router.push('/addListing')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        {error}
      </Typography>
    )
  }

  // if (data.length === 0) {
  //   return <Typography sx={{ textAlign: 'center', mt: 4 }}>No listings available for this user.</Typography>
  // }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <OwnerMetrics/>
      <Button variant="contained" color="primary" sx={{ mb: 2, mt:2 }} onClick={handleAddListing}>
        Add a Listing
      </Button>
      <List
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          border: '1px solid lightgray',
          borderRadius: '8px',
          padding: 0,
        }}
      >
        {data.map(item => (
          <ListItem
            key={item.property_id}
            sx={{
              mb: 2,
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
            onClick={() => window.open(`/property/${item.property_id}`, '_blank')}
          >
            <Card sx={{ display: 'flex', width: '100%', position: 'relative' }}>
              {item.image_url && (
                <CardMedia component="img" sx={{ width: 150 }} image={item.image_url} alt="Property Image" />
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent>
                  <Typography variant="h6">
                    {item.address} - {item.rental_or_sale?.toUpperCase() || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bedrooms: {item.bedrooms || 'N/A'}, Bathrooms: {item.bathrooms || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${item.price?.toLocaleString() || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Flood Risk: {item.current_flood_risk || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated: {item.last_updated || 'N/A'}
                  </Typography>

                </CardContent>
                <Button variant="contained" color="primary" sx={{ mb: 2, mt:2 }}  onClick={e => {
                    e.stopPropagation() // Prevent card click from triggering
                    handleCalculateFlood(item.property_id)
                  }}>
                Calculate Flood Risk
                </Button>
              </Box>


              <IconButton
                aria-label="delete"
                color="error"
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={e => {
                  e.stopPropagation() // Prevent card click from triggering
                  handleDelete(item.property_id)
                }}
              >
                <DeleteIcon />
              </IconButton>


            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default PropertyListings
