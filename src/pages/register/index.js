'use client'

import { Alert, Box, Button, Container, Divider, Grid, Snackbar, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useEffect, useState } from 'react'

import RegisterPageLayout from '../../components/register-layout'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '', // Organization name field
    userAddress: '', // Address field
    email: '',
    phone: '',
    password: '',
    dob: null, // Date of birth field
  })
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [mounted, setMounted] = useState(false) // To handle hydration issues

  // Ensure the component is mounted before rendering dynamic content
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = date => {
    setFormData(prev => ({ ...prev, dob: date }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const payload = {
      ...formData,
      role: 'owner', // Always submitting as 'owner'
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setNotification({
          open: true,
          message: data.message || 'Registration successful!',
          severity: 'success',
        })
      } else {
        const errorData = await response.json()
        setNotification({
          open: true,
          message: errorData.error || 'Registration failed. Please try again.',
          severity: 'error',
        })
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Network error. Please try again later.',
        severity: 'error',
      })
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Return null during server-side rendering to avoid hydration mismatch
  if (!mounted) return null

  return (
    <RegisterPageLayout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              Register as Owner
            </Typography>

            {/* Owner Registration Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              <Grid container spacing={2}>
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
                <Grid item xs={12}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dob}
                    onChange={handleDateChange}
                    renderInput={params => <TextField {...params} fullWidth required />}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register as Owner
              </Button>
            </Box>

            {/* User Registration - Commented Out */}
            {/*
            <Box component="form" sx={{ mt: 2, width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
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
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register as User
              </Button>
            </Box>
            */}

            {/* Toggle Button for Owner Registration - Commented Out */}
            {/*
            <Divider sx={{ my: 3, width: '100%' }}>Or sign up as an Owner</Divider>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Switch to Owner Registration
            </Button>
            */}
          </Box>

          {/* Notification Snackbar */}
          <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
            <Alert onClose={handleCloseNotification} severity={notification.severity}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </LocalizationProvider>
    </RegisterPageLayout>
  )
}

export default RegisterForm
