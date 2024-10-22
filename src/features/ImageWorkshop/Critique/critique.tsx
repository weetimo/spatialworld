import React from 'react'
import { Box, Typography } from '@mui/material'

const Critique: React.FC<{ critique?: string }> = ({ critique }) => {
  const renderCritique = (critiqueText?: string) => {
    if (!critiqueText) return null

    return critiqueText.split('||').map((section, index) => {
      const [boldText, regularText] = section.split(':')
      
      return (
        <Box key={index} sx={{ mb: '2rem' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {boldText.trim()}
          </Typography>
          <Typography variant="body2">{regularText?.trim()}</Typography>
        </Box>
      )
    })
  }

  return (
    <Box
      sx={{
        padding: '0.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      {renderCritique(critique)}
    </Box>
  )
}

export default Critique
