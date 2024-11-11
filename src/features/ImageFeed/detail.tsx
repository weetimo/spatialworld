import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Avatar } from '@mui/material'
import { ArrowBack, Favorite, FavoriteBorder, Visibility } from '@mui/icons-material'
import { garden1 } from '../../assets/sample-photos'

const FeedDetail: React.FC = () => {
  // const location = useLocation()
  const navigate = useNavigate()
  // const post = location.state?.post

  const post = {
    user: { name: 'Wei Ming' },
    imageUrl: garden1,
    upscaledPrompt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    voters: [{ name: 'Wei Ming' }, { name: 'Caitlin' }, { name: 'Aditya' }],
    viewers: [{ name: 'Wei Ming' }, { name: 'Caitlin' }, { name: 'Aditya' }]
  }

  if (!post) {
    return <Typography>No post found</Typography>
  }

  const { user, imageUrl, upscaledPrompt, voters, viewers } = post

  const [likes, setLikes] = useState(voters?.length || 0)
  const [liked, setLiked] = useState(false)

  const handleLike = (): void => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <Box sx={styles.container}>
      <IconButton onClick={() => navigate('/feed')} sx={styles.backButton}>
        <ArrowBack />
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        src={imageUrl}
        alt="Generated Image"
        sx={styles.image}
      />

      {/* User Info */}
      <Box sx={styles.userInfo}>
        <Avatar src={user?.name} alt={user?.name} sx={styles.avatar} />
        <Typography variant="subtitle1" sx={styles.userName}>
          {user?.name}
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body2" sx={styles.description}>
        {upscaledPrompt}
      </Typography>

      {/* Stats */}
      <Box sx={styles.statsContainer}>
        <Box sx={styles.statItem}>
          <IconButton onClick={handleLike} sx={styles.heartButton}>
            {liked ? <Favorite sx={styles.heartIconLiked} /> : <FavoriteBorder sx={styles.heartIcon} />}
          </IconButton>
          <Typography variant="body2" sx={styles.statText}>{likes}</Typography>
        </Box>
        <Box sx={styles.statItem}>
          <Visibility sx={styles.eyeIcon} />
          <Typography variant="body2" sx={styles.statText}>{viewers?.length || 0}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    backgroundColor: '#f0f4ff',
    padding: '1.5rem',
    height: '100vh'
  },
  image: {
    height: '350px',
    width: '100%',
    borderRadius: '1.2rem',
    marginBottom: '1.5rem',
    marginTop: '1rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: '0.5rem'
  },
  avatar: {
    width: '50px',
    height: '50px',
    marginRight: '1rem',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#333',
  },
  description: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    padding: '0.5rem'
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '1.2rem'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  heartButton: {
    padding: 0,
  },
  heartIcon: {
    color: '#ccc',
    fontSize: '1.5rem',
  },
  heartIconLiked: {
    color: '#000',
    fontSize: '1.5rem',
  },
  eyeIcon: {
    color: '#999',
    fontSize: '1.5rem',
  },
  statText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
  },
}

export default FeedDetail
