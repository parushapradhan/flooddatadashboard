import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface PropertyDetails {
  property_id: number;
  address: string;
  region_name: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  current_flood_risk: string;
  square_feet: number;
  rental_or_sale: string;
  number_of_complaints: number;
  image_url: string;
  owner_email: string;
}

interface ClimateData {
  year: number;
  average_rainfall_mm: number;
  max_rainfall_mm: number;
  temperature_c: number;
  source: string;
}

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchPropertyDetails = async () => {
        try {
          const propertyResponse = await fetch(`/api/properties?id=${id}`);
          const propertyData = await propertyResponse.json();

          if (!propertyData || !propertyData.property_id) {
            setProperty(null);
            return;
          }
          setProperty(propertyData);

          const climateResponse = await fetch(
            `/api/climateData?district=${propertyData.region_name}`
          );
          const climateData = await climateResponse.json();
          setClimateData(Array.isArray(climateData) ? climateData : []);
        } catch (err) {
          console.error('Error fetching data:', err);
          setProperty(null);
        }
      };

      fetchPropertyDetails();
    }
  }, [id]);

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    const year = event.target.value ? Number(event.target.value) : null;
    setSelectedYear(year);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !email || !message) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/contactOwner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property?.property_id,
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send the message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('An unexpected error occurred.');
    }
  };

  const filteredClimateData = selectedYear
    ? climateData?.filter((data) => data.year === selectedYear)
    : climateData;

  if (!property) {
    return <Typography variant="h5">Property details not found.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Property Details Section */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {property.region_name} - Property Details
      </Typography>
      <Card>
        <img
          src={property.image_url || 'https://via.placeholder.com/400x300'}
          alt={property.region_name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </Card>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          Property Details
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>{property.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price</TableCell>
              <TableCell>{property.price ? `$${property.price}` : 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bedrooms</TableCell>
              <TableCell>{property.bedrooms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bathrooms</TableCell>
              <TableCell>{property.bathrooms}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Flood Risk</TableCell>
              <TableCell>{property.current_flood_risk}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Climate Data Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Climate Data
        </Typography>
        <FormControl sx={{ minWidth: 200, marginBottom: 2 }} size="small">
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear?.toString() || ''}
            onChange={handleYearChange}
            displayEmpty
          >
            <MenuItem value="">All Years</MenuItem>
            {climateData?.map((data) => (
              <MenuItem key={data.year} value={data.year.toString()}>
                {data.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filteredClimateData && filteredClimateData.length > 0 ? (
          <Table>
            <TableBody>
              {filteredClimateData.map((data, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>Year</TableCell>
                    <TableCell>{data.year}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Rainfall (mm)</TableCell>
                    <TableCell>{data.average_rainfall_mm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Max Rainfall (mm)</TableCell>
                    <TableCell>{data.max_rainfall_mm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Temperature (°C)</TableCell>
                    <TableCell>{data.temperature_c}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell>{data.source}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No climate data available.</Typography>
        )}
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contact the Owner
        </Typography>
        <form onSubmit={handleContactSubmit}>
          {success && <Alert severity="success">Message sent successfully!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Send Message
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default PropertyDetailsPage;
