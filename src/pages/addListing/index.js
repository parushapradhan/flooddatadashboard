import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/router';

const AddRentalListing = () => {
  const [formData, setFormData] = useState({
    property_id: '',
    listing_date: '',
    price: '',
    rental_or_sale: 'rental',
    flood_risk_disclosed: false,
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    image_url: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/addRentalListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add listing');
      }

      const result = await response.json();
      alert('Listing added successfully!');
      router.push('/'); // Redirect to home page or listings page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add a Rental Listing
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Property ID"
          name="property_id"
          type="number"
          fullWidth
          required
          value={formData.property_id}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Listing Date"
          name="listing_date"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={formData.listing_date}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
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
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Listing'}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default AddRentalListing;
