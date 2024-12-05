import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

const PropertyPage = () => {
  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          The Julian
        </Typography>
        <Typography variant="body1" color="text.secondary">
          419 Melwood Ave, Pittsburgh, PA 15213
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={2}>
        {/* Left Section */}
        <Grid item xs={12} md={8}>
          {/* Image Section */}
          <Card sx={{ marginBottom: 2 }}>
            <CardMedia
              component="img"
              height="300"
              image="https://via.placeholder.com/800x300" // Replace with the image URL
              alt="Property"
            />
          </Card>

          {/* What's Available Section */}
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              What's Available
            </Typography>
            {/* Example List */}
            <Box>
              {[
                {
                  name: 'The Carson',
                  size: '304 sqft',
                  price: '$1,999',
                  type: 'Studio',
                  availability: 'Available Soon',
                },
                {
                  name: 'The Schenley',
                  size: '420 sqft',
                  price: '$2,075',
                  type: 'Studio',
                  availability: 'Available Soon',
                },
                {
                  name: 'The Sienna',
                  size: '540 sqft',
                  price: '$2,400',
                  type: '1 Bedroom',
                  availability: 'Available Soon',
                },
              ].map((item, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.type} • {item.size}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ marginTop: 1 }}>
                      {item.price}
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ marginTop: 2 }}>
                      {item.availability}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4}>
          {/* Contact Form */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact This Property
              </Typography>
              <TextField fullWidth label="Name" margin="normal" />
              <TextField fullWidth label="Phone" margin="normal" />
              <TextField fullWidth label="Email" margin="normal" />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                defaultValue="I am interested in this rental and would like to schedule a viewing."
                margin="normal"
              />
              <Button variant="contained" fullWidth>
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PropertyPage
