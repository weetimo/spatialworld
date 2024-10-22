import React from 'react'
import { Box, Typography } from '@mui/material'
import { Carousel } from '../../../components'

const ImageCarousel: React.FC<{ images?: string[] }> = ({ images }) => {
  return (
    <Box sx={{ mt: '2rem' }}>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', mb: '-1.8rem' }}>
        What would you like to change?
      </Typography>
      
      <Carousel images={images} />
    </Box>
  )
}

export default ImageCarousel
