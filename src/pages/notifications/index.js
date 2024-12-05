import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

const NotificationsPage = () => {
  const [userDetails, setUserDetails] = useState(null) // Store user details
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUserDetails = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      if (!token) throw new Error('Missing authentication token')

      const response = await fetch('/api/getUserSession', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch user session')

      const data = await response.json()
      console.log('User session data:', data) // Debugging
      setUserDetails(data) // Store user details
    } catch (err) {
      console.error('Error fetching user session:', err)
      setError(err.message)
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      if (!token) throw new Error('Missing authentication token')

      const response = await fetch('/api/getNotifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch notifications')
      }

      const data = await response.json()
      console.log('Notifications:', data.notifications)
      setNotifications(data.notifications)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {userDetails && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: '#1976d2' }}>{userDetails.name[0].toUpperCase()}</Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              Welcome, {userDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userDetails.email}
            </Typography>
          </Box>
        </Box>
      )}

      <Card
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon fontSize="large" color="primary" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: '#1976d2' }}>
              Notifications
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {notifications.length > 0 ? (
            <List>
              {notifications.map(notification => (
                <React.Fragment key={notification.notification_id}>
                  <ListItem
                    sx={{
                      bgcolor: '#f5f5f5',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: '#e0e0e0' },
                    }}
                  >
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.created_at).toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              You have no notifications at the moment.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default NotificationsPage
