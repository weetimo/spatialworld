import React from 'react'
import { IconButton, Box, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import InfoIcon from '@mui/icons-material/Info'

interface HeaderProps {
  onInfoClick: () => void
  critique?: string
}

const Header: React.FC<HeaderProps> = ({ onInfoClick, critique }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1rem',
        mb: '-1rem'
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
      
      <IconButton
        edge="end"
        onClick={onInfoClick}
        sx={{
          visibility: critique?.trim() === '' ? 'hidden' : 'visible',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' },
        }}
      >
        <InfoIcon />
      </IconButton>
      <IconButton 
        edge="end"
        sx={{
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  )
}

export default Header
