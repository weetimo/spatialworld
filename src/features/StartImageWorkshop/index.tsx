import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { robot } from '../../assets/graphics'

const StartWorkshop: React.FC = () => {
  const navigate = useNavigate()

  const handleStartWorkshop = () => {
    navigate('/image-workshop')
  }

  return (
    <Box sx={styles.container}>
      {/* Image */}
      <Box
        component="img"
        src={robot}
        alt="Creative Robot"
        sx={styles.image}
      />

      {/* Title */}
      <Typography variant="h4" sx={styles.title}>
        Time to create your image
      </Typography>

      {/* Subtitle */}
      <Typography variant="body1" sx={styles.subtitle}>
        We’ve gathered your input. Now let’s bring your vision to life.
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        onClick={handleStartWorkshop}
        sx={styles.startButton}
        fullWidth
      >
        Start Image Workshop
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    maxWidth: '400px',
    margin: '0 auto',
    minHeight: '100vh',
    boxSizing: 'border-box',
    textAlign: 'center'
  },
  image: {
    width: '70%',
    maxWidth: '250px',
    marginBottom: '2rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '3rem',
    marginTop: '1rem'
  },
  startButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    textTransform: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '0.6rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
}

export default StartWorkshop
