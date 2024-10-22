import React from 'react'
import { Box } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import Carousel from 'react-material-ui-carousel'

const CarouseLComponent: React.FC<{ images?: string[] }> = ({ images }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '100%',
        height: 'auto',
        padding: '1rem'
      }}
    >
      <Carousel
        navButtonsAlwaysVisible
        PrevIcon={<ArrowBackIos sx={{ fontSize: '20px' }}  />}
        NextIcon={<ArrowForwardIos sx={{ fontSize: '20px' }}  />}
        navButtonsWrapperProps={{
          style: {
            transform: 'translateY(40%)'
          },
        }}
        indicatorContainerProps={{
          style: { margin: '1.8rem 0', textAlign: 'center' },
        }}
        indicatorIconButtonProps={{
          style: { margin: '0 0.2rem', color: 'gray' },
        }}
        activeIndicatorIconButtonProps={{
          style: { color: 'black' },
        }}
        autoPlay={false}
        swipe={true}
      >
        {images?.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Slide ${index + 1}`}
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        ))}
      </Carousel>
    </Box>
  )
}

export default CarouseLComponent
