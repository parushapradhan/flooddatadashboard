import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/router' // Import the useRouter hook
import React from 'react'

const RegisterPageLayout = ({ children }) => {
  const router = useRouter() // Initialize the router

  const handleLoginRedirect = () => {
    router.push('/login') // Redirect to the login page
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Registration System
          </Typography>
          <Button color="inherit" onClick={handleLoginRedirect}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Registration System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default RegisterPageLayout
