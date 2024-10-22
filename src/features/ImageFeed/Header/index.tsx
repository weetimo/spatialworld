import React from 'react'
import { IconButton, Box, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'

const Header: React.FC = () => {
  const handleHomeClick = (): void => {
    console.log('Home clicked')
  }

  const handleSettingsClick = (): void => {
    console.log('Settings clicked')
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #ccc',
        position: 'relative',
        height: '60px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton edge="start">
          <img 
            src="/path-to-logo.png" 
            alt="App Logo" 
            style={{ width: '40px', height: '40px' }} 
          />
        </IconButton>
        <IconButton
          onClick={handleHomeClick}
          sx={{
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
          }}
        >
          <HomeIcon />
        </IconButton>
      </Box>

      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        App Name
      </Typography>

      <IconButton
        onClick={handleSettingsClick}
        sx={{
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' },
        }}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  )
}

export default Header
