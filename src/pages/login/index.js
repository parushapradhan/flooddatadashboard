'use client'

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        Cookies.set('auth_token', data.token, { path: '/' })
        setNotification({ open: true, message: 'Login successful!', severity: 'success' })
        setTimeout(() => (window.location.href = '/'), 2000)
      } else {
        const errorData = await response.json()
        setNotification({ open: true, message: errorData.error || 'Login failed!', severity: 'error' })
      }
    } catch {
      setNotification({ open: true, message: 'Network error. Please try again.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterRedirect = () => {
    router.push('/register')
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? theme.palette.background.default : '#f7f9fc',
        padding: 4,
        transition: 'background-color 0.3s',
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: isDarkMode ? theme.palette.background.paper : '#fff',
          borderRadius: 2,
          boxShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.1)',
          p: 4,
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: theme.palette.text.primary,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          component="p"
          variant="body2"
          align="center"
          sx={{ mb: 4, color: theme.palette.text.secondary }}
        >
          Please login to your account to continue.
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mb: 2,
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
            }}
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
          <Divider sx={{ mb: 3, color: theme.palette.text.secondary }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegisterRedirect}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.dark,
              },
            }}
          >
            Create an Account
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  )
}

export default LoginPage
