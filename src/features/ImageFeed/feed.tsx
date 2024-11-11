import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, IconButton, Avatar } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { garden1 } from '../../assets/sample-photos'

// TEST DATA
const posts = [
  { id: 1, name: 'Wei Ming', image: garden1 },
  { id: 2, name: 'Caitlin', image: garden1 },
  { id: 3, name: 'Timothy', image: garden1 },
  { id: 3, name: 'Timothy', image: garden1 },
]

const Feed: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const handleLike = (postId: number): void => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.headerTitle}>
          Explore Feeds
        </Typography>
        <Typography variant="body2" sx={styles.headerSubtitle}>
          Explore other residents&apos; thoughts and ideas of redesigning!
        </Typography>
      </Box>

      {/* Feed Content */}
      <Box sx={styles.content}>
        {posts.map((post) => (
          <Link to={`/feed/${post.id}`} key={post.id} state={{ post }} style={styles.link}>
            <Box sx={styles.postContainer}>
              <Box sx={styles.userInfo}>
                <Avatar src={post.name} alt={post.name} sx={styles.avatar} />
                <Typography variant="subtitle1" sx={styles.userName}>
                  {post.name}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.preventDefault()
                    handleLike(post.id)
                  }}
                  sx={styles.heartButton}
                >
                  {likedPosts.includes(post.id) ? (
                    <Favorite sx={styles.heartIconLiked} />
                  ) : (
                    <FavoriteBorder sx={styles.heartIcon} />
                  )}
                </IconButton>
              </Box>

              <Box
                component="img"
                src={post.image}
                alt="Post"
                sx={styles.postImage}
              />
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4ff',
    boxSizing: 'border-box',
    width: '100%',
    alignItems: 'center',
    margin: '0',
    justifyContent: 'center',
  },
  header: {
    marginBottom: '1rem',
    padding: '1.5rem',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#333',
  },
  headerSubtitle: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    background: '#fff',
    width: '100%',
    paddingTop: '1.5rem',
    paddingBottom: '2.5rem',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  postContainer: {
    borderRadius: '12px',
    padding: '0.5rem 2.5rem',
    marginBottom: '0rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    marginRight: '0.75rem',
  },
  userName: {
    fontWeight: 'bold',
    flexGrow: 1,
    color: '#333',
  },
  heartButton: {
    padding: 0,
  },
  heartIcon: {
    color: '#ccc',
  },
  heartIconLiked: {
    color: '#ff4d4d',
  },
  postImage: {
    borderRadius: '8px',
    objectFit: 'cover',
    height: '150px',
    width: '100%'
  },
  link: {
    textDecoration: 'none',
  },
}

export default Feed
