import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const AddRentalListing = () => {
  const [formData, setFormData] = useState({
    price: '',
    rental_or_sale: 'rental',
    flood_risk_disclosed: false,
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    image_url: '',
    location: '',
    number_of_complaints: '', // New field
    is_rental: false, // New field
    district_name: '', // New field for district
  })

  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const districts = ['Kathmandu', 'Pokhara', 'Chitwan', 'Biratnagar', 'Lalitpur', 'Bhaktapur', 'Dharan'] // Add more districts as needed

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'location') {
      fetchSuggestions(value)
    }
  }

  const fetchSuggestions = async searchQuery => {
    if (!searchQuery) {
      setSuggestions([])
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions')
      }

      const data = await response.json()
      setSuggestions(data)
    } catch (err) {
      console.error(err)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleSuggestionClick = suggestion => {
    setFormData(prevData => ({
      ...prevData,
      location: suggestion.display_name,
    }))
    setSuggestions([])
  }

  const fetchUserId = async () => {
    try {
      const response = await fetch('/api/getUserSession')
      if (!response.ok) {
        throw new Error('Failed to fetch user session')
      }
      const data = await response.json()
      return data.userId // Assumes `getUserSession` API returns `userId` in the response
    } catch (err) {
      console.error(err)
      throw new Error('Unable to fetch user ID')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      // const userId = await fetchUserId(); // Fetch user ID
      const userId = 1
      const response = await fetch('/api/addPropertyListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: userId }), // Include user ID
      })

      if (!response.ok) {
        throw new Error('Failed to add listing')
      }

      const result = await response.json()
      alert('Listing added successfully!')
      router.push('/') // Redirect to home page or listings page
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add a Property Listing
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Existing Fields */}
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          required
          value={formData.price}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          value={formData.location}
          onChange={handleChange}
          placeholder="Start typing location..."
          sx={{ mb: 2 }}
        />
        {loadingSuggestions && <Typography>Loading suggestions...</Typography>}
        {suggestions.length > 0 && (
          <ul
            style={{ listStyleType: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'scroll' }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        <TextField
          label="District Name"
          name="district_name"
          select
          fullWidth
          required
          value={formData.district_name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {districts.map((district, index) => (
            <MenuItem key={index} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Bedrooms"
          name="bedrooms"
          type="number"
          fullWidth
          required
          value={formData.bedrooms}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Bathrooms"
          name="bathrooms"
          type="number"
          fullWidth
          required
          value={formData.bathrooms}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Square Feet"
          name="square_feet"
          type="number"
          fullWidth
          required
          value={formData.square_feet}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Image URL"
          name="image_url"
          type="url"
          fullWidth
          value={formData.image_url}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="flood_risk_disclosed"
              checked={formData.flood_risk_disclosed}
              onChange={handleChange}
            />
          }
          label="Flood Risk Disclosed"
        />

        <FormControlLabel
          control={<Checkbox name="is_rental" checked={formData.is_rental} onChange={handleChange} />}
          label="Is Rental"
        />

        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          {loading ? 'Adding...' : 'Add Listing'}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  )
}

export default AddRentalListing
