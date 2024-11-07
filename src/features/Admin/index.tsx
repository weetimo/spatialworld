import React from 'react'
import { Box, Typography, TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const Admin: React.FC = () => {
  return (
    <>
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton sx={{ 
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)', // Changed from 0.7 to 0.5 for lighter hover
              borderRadius: '4px'
            }
          }}>
            <img 
              src="https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png"
              alt="URA Logo"
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant="h5">
            Public Engagement Dashboard
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '4px',
          padding: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          mb: 3
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search..."
            InputProps={{
              disableUnderline: true,
              sx: { padding: '0 0.5rem' }
            }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          <Box sx={{ 
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}>
            <img 
              src="/path-to-golf-course-image.jpg"
              alt="SCTB Green Spaces"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                SCTB Green Spaces
              </Typography>
              <Typography variant="body2" color="text.secondary">
                25 days more to review
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Admin
