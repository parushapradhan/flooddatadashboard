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
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('auth_token', data.token, { path: '/' });
        setNotification({ open: true, message: 'Login successful!', severity: 'success' });
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        const errorData = await response.json();
        setNotification({ open: true, message: errorData.error || 'Login failed!', severity: 'error' });
      }
    } catch {
      setNotification({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
          <TextField fullWidth label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 2 }} />
          <Button fullWidth type="submit" variant="contained" disabled={loading}>{loading ? 'Signing In...' : 'Login'}</Button>
        </Box>
      </Box>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
