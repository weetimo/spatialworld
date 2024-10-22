import React from 'react'
import { Box, IconButton, Grid, Typography } from '@mui/material'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import { garden0, garden1, garden2, garden3 } from '../../assets/sample-photos'
import Header from './Header'

// TEMPORARY SAMPLE DATA
const sampleImages = [garden0, garden1, garden2, garden3]
const imagesFeed = Array.from({ length: 5 }, () => sampleImages).flat()

const ImageFeed: React.FC = () => {
  const handleUpvote = (image: string): void => {
    console.log('Upvoted image:', image)
  }

  return (
    <>
      <Header />

      <Box sx={{ padding: '1rem' }}>
        <Typography variant="h6" sx={{ mb: '1rem' }}>
          Community Image Feed
        </Typography>

        <Grid container spacing={2}>
          {imagesFeed.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  height: '180px'
                }}
              >
                <img
                  src={image}
                  alt={`Image ${index}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: '0.4rem',
                    right: '0.4rem',
                    backgroundColor: 'white',
                    padding: 0,
                    '&:hover': { backgroundColor: '#F1C385' },
                    '&:focus': { outline: 'none' },
                    '&:focus-visible': { outline: 'none' }
                  }}
                  onClick={() => handleUpvote(image)}
                >
                  <ArrowCircleUpIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </> 
  )
}

export default ImageFeed
