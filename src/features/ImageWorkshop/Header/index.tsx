import React from 'react'
import { IconButton, Box, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import InfoIcon from '@mui/icons-material/Info'

interface HeaderProps {
  onInfoClick: () => void
  critique?: string
}

const Header: React.FC<HeaderProps> = ({ onInfoClick, critique }) => {
  const handleMenuClick = (): void => {
    console.log('Menu clicked')
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1rem',
        mb: '-1rem',
        position: 'relative',
        height: '60px',
      }}
    >
      <IconButton edge="start">
        <img 
          src="/path-to-logo.png" 
          alt="App Logo" 
          style={{ width: '40px', height: '40px' }} 
        />
      </IconButton>

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

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          onClick={handleMenuClick}
          edge="end"
          sx={{
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Header
