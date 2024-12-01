'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import Cookies from 'js-cookie'; // To manage cookies

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [mounted, setMounted] = useState(false); // To handle hydration issues
  const [loading, setLoading] = useState(false); // Loading state for the button

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the auth token in cookies
        Cookies.set('auth_token', data.token, { path: '/' });

        setNotification({ open: true, message: 'Login successful!', severity: 'success' });
        setTimeout(() => {
          window.location.href = '/'; // Redirect to the dashboard/homepage
        }, 2000);
      } else {
        const errorData = await response.json();
        setNotification({ open: true, message: errorData.error || 'Login failed!', severity: 'error' });
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setNotification({
        open: true,
        message: 'Network error. Please try again later.',
        severity: 'error',
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Ensure the component is mounted before rendering dynamic content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during server-side rendering to avoid hydration mismatch
  if (!mounted) return null;

  return (
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!email || !password || loading} // Disable button if form is incomplete or loading
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
        </Box>
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
  );
};

export default LoginPage;
