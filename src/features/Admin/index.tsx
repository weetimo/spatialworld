import React, { useState, useRef } from 'react'
import { Box, Typography, TextField, IconButton, Button, Dialog, DialogContent, DialogActions } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

interface ImageData {
  url: string;
  caption: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const [showTitleScreen, setShowTitleScreen] = useState(false)
  const [showContextScreen, setShowContextScreen] = useState(false)
  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showQuestionsScreen, setShowQuestionsScreen] = useState(false)

  const handleOpenTitleScreen = () => {
    setShowTitleScreen(true)
  }

  const handleDone = () => {
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    setTitleError(false)
    setShowTitleScreen(false)
    setShowContextScreen(true)
  }

  const handleContextDone = () => {
    setShowContextScreen(false)
    setShowQuestionsScreen(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result as string)
        setUploadDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadDone = () => {
    if (tempImage && caption) {
      setImages([...images, { url: tempImage, caption }])
      setUploadDialogOpen(false)
      setTempImage(null)
      setCaption('')
    }
  }

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  if (showTitleScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          mt: 8
        }}>
          <Typography variant='h3' sx={{ mb: 6 }}>Let's start with a title</Typography>
          <TextField
            autoFocus
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setTitleError(false)
            }}
            placeholder="Type here"
            variant="standard"
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1
              },
              '& .MuiInputBase-input': {
                color: 'text.primary'
              },
              '& input': {
                color: 'text.primary'
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'text.secondary'
              }
            }}
            error={titleError}
            InputProps={{
              style: { color: 'inherit' }
            }}
          />
          {titleError && (
            <Typography color="error" sx={{ mb: 4, alignSelf: 'flex-start' }}>
              Please enter a title for the engagement session.
            </Typography>
          )}
          <Button 
            onClick={handleDone}
            variant="contained"
            sx={{
              borderRadius: '20px',
              px: 6,
              py: 1,
              textTransform: 'none'
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    )
  }

  if (showContextScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 8,
          ml: 4
        }}>
          <Typography variant='h3' sx={{ mb: 6, maxWidth: '100%', width: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}>
            Great! Now let's provide some contextual information for the participants!
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            width: '100%',
          }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: '400px',
                height: '250px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <AddCircleOutlineIcon sx={{ fontSize: '40px', color: 'grey', mb: 2 }} />
              <Typography variant='h6'>Upload Image</Typography>
            </Box>

            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: '400px',
                  height: '250px',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  '&:hover .caption-overlay': {
                    display: 'flex',
                  }
                }}
              >
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  className="caption-overlay"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    display: 'none',
                    padding: '1rem',
                    textAlign: 'left',
                    height: 'auto',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ 
                    ml: 1,
                    fontSize: '1rem',
                    flex: 1,
                  }}>
                    {image.caption}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Button 
            variant="contained"
            onClick={handleContextDone}
            disabled={images.length === 0}
            sx={{
              borderRadius: '20px',
              px: 6,
              py: 1,
              textTransform: 'none',
              mt: 4,
              opacity: images.length === 0 ? 0.5 : 1
            }}
          >
            Next
          </Button>
        </Box>

        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
          <DialogContent>
            {tempImage && (
              <img
                src={tempImage}
                alt="Upload preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }}
              />
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a description for this image..."
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDone} variant="contained" disabled={!caption}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  if (showQuestionsScreen) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 8,
          ml: 4
        }}>
          <Typography variant='h3' sx={{ mb: 6 }}>
            Add questions you'd like to ask the participants!
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: '20px',
                py: 2,
                px: 4,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Multiple Choice Question
            </Button>

            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: '20px',
                py: 2,
                px: 4,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Open Ended Question
            </Button>
          </Box>

          <Box sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: '20px',
                px: 6,
                py: 1,
                textTransform: 'none'
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ padding: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }
            }}
          >
            <img
              src='https://www.sla.gov.sg/qql/slot/u143/Newsroom/Press%20Releases/2019/Grange%20Road/URA%20logo.png'
              alt='URA Logo'
              style={{ height: '80px' }}
            />
          </IconButton>
          <Typography variant='h5'>Public Engagement Dashboard</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: '4px',
            padding: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 3
          }}
        >
          <TextField
            fullWidth
            variant='standard'
            placeholder='Search...'
            InputProps={{
              disableUnderline: true,
              sx: { padding: '0 0.5rem' }
            }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}
        >
          <Box
            onClick={() => navigate('/Admin_home')}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }
            }}
          >
            <img
              src='src/features/Admin_home/HomeContent/images/base_inpaint.jpg'
              alt='SCTB Green Spaces'
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant='subtitle1' fontWeight='bold'>
                SCTB Green Spaces
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                25 days more to review
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={handleOpenTitleScreen}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              },
              height: '100%'
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: '40px', color: 'lightgrey' }} />
            <Typography variant='button' sx={{ color: 'black', mt: 1 }}>
              Create New Engagement Session
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Admin
