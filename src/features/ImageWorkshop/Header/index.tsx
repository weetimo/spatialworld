import React from 'react'
import { IconButton, Box, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const Header: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1rem'
      }}
    >
      <IconButton edge="start">
        <img 
          src="/path-to-logo.png" 
          alt="App Logo" 
          style={{ width: '40px', height: '40px' }} 
        />
      </IconButton>
      
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
        App Name
      </Typography>
      
      <IconButton edge="end">
        <MenuIcon />
      </IconButton>
    </Box>
  )
}

export default Header
