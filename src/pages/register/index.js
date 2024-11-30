'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import RegisterPageLayout from '../../components/register-layout';

const RegisterForm = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // New phone number field
    password: '',
    userAddress: '', // For User
    organizationName: '', // For Owner
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [mounted, setMounted] = useState(false); // To handle hydration issues

  // Ensure the component is mounted before rendering dynamic content
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setIsOwner((prev) => !prev);
    setFormData((prev) => ({
      ...prev,
      userAddress: '',
      organizationName: '',
    })); // Clear role-specific fields when switching
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = isOwner
      ? { ...formData, role: 'owner' }
      : { ...formData, role: 'user' };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({ open: true, message: data.message || 'Registration successful!', severity: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({
          open: true,
          message: errorData.error || 'Registration failed. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Network error. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Return null during server-side rendering to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <RegisterPageLayout>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Register as {isOwner ? 'Owner' : 'User'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              {!isOwner && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="userAddress"
                    label="Address"
                    name="userAddress"
                    value={formData.userAddress}
                    onChange={handleChange}
                  />
                </Grid>
              )}
              {isOwner && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="organizationName"
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register as {isOwner ? 'Owner' : 'User'}
            </Button>
          </Box>
          <Divider sx={{ my: 3, width: '100%' }}>
            Or sign up as an Owner
          </Divider>
          <Button
            variant="outlined"
            onClick={handleToggle}
            fullWidth
            sx={{ mt: 1 }}
          >
            {isOwner ? 'Switch to User Registration' : 'Switch to Owner Registration'}
          </Button>
        </Box>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </RegisterPageLayout>
  );
};

export default RegisterForm;
