import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, TextareaAutosize, Button, Snackbar, Alert } from '@mui/material'
import { ContentCopy as ContentCopyIcon, Loop as ResetIcon } from '@mui/icons-material'
import { useDatabase, useCloudinary, useCurrentUser } from '../../../hooks'
import starIcon from '../../../assets/icons/ai.png'
import activeStarIcon from '../../../assets/icons/ai-white.png'
import { v4 as uuidv4 } from 'uuid'

interface PromptInputProps {
  engagementId: string
  promptText: string
  setPromptText: React.Dispatch<React.SetStateAction<string>>
  handleProcessPrompt: () => void
  loading: boolean
  previousPrompt?: string
  handleGoToPreviousGeneration?: () => void
  isImageEdited: boolean
  finalImage: FinalImage | null
  upscaledPrompt: string 
  category: string
  coordinates?: any
}

interface FinalImage {
  src: string
}

const PromptInput: React.FC<PromptInputProps> = ({
  engagementId,
  promptText,
  setPromptText,
  handleProcessPrompt,
  loading,
  finalImage,
  upscaledPrompt,
  category,
  coordinates
}) => {
  const navigate = useNavigate()
  const { updateData } = useDatabase()
  const { uploadImage } = useCloudinary()
  const { currentUser } = useCurrentUser()

  const [copySuccessSnackbarOpen, setCopySuccessSnackbarOpen] = useState(false)
  const isActive: boolean = promptText.length > 0 && !loading

  const handleCopyPrompt = (): void => {
    navigator.clipboard.writeText(promptText)
    setCopySuccessSnackbarOpen(true)
  }

  const handleCloseSnackbar = (): void => setCopySuccessSnackbarOpen(false)

  const handleResetPrompt = (): void => setPromptText('')

  const base64ToFile = (base64Image: string): File => {
    const byteString = atob(base64Image.split(',')[1]) // Decode Base64 string
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uintArray = new Uint8Array(arrayBuffer)
  
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i)
    }

    const mimeType = 'image/jpeg'
    const fileName = 'image.jpg'
  
    return new File([arrayBuffer], fileName, { type: mimeType })
  }

  const handleEndJourney = async (): Promise<void> => {
    const formattedImage = base64ToFile(finalImage?.src)
    const cloudinaryUrl = await uploadImage(formattedImage)

    const uniqueId = uuidv4()

    await updateData(`generations/${engagementId}/${currentUser?.id}`, {
      category,
      createdAt: new Date().toISOString(),
      engagementId,
      imageUrl: cloudinaryUrl,
      originalPrompt: promptText,
      upscaledPrompt,
      userId: currentUser?.id,
      voters: [],
      coordinates
    })

    navigate(`/feed/${engagementId}`)
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.inputContainer}>
        {/* Prompt Input */}
        <Box sx={styles.textAreaContainer}>
          <TextareaAutosize
            aria-label="input prompt"
            minRows={4}
            placeholder="Input here"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            style={styles.textArea}
          />
        </Box>

        {/* Action Buttons (Copy, Reset, Send) */}
        <Box sx={styles.actionContainer}>
          <Box sx={styles.iconButtons}>
            <IconButton onClick={handleCopyPrompt} size="small" disabled={loading} sx={styles.icon}>
              <ContentCopyIcon />
            </IconButton>
            <IconButton onClick={handleResetPrompt} size="small" disabled={loading} sx={styles.icon}>
              <ResetIcon />
            </IconButton>
          </Box>

          <IconButton
            onClick={handleProcessPrompt}
            disabled={!isActive}
            sx={{
              ...styles.sendButton,
              backgroundColor: isActive ? '#007bff' : 'default',
              '&:hover': { backgroundColor: isActive ? '#007bff' : 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Box
              component="img"
              src={isActive ? activeStarIcon : starIcon}
              alt="Send"
              sx={styles.sendIcon}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Finish Button */}
      <Button variant="contained" fullWidth sx={styles.finishButton} onClick={handleEndJourney}>
        End Journey
      </Button>

      {/* Snackbar Notification */}
      <Snackbar
        open={copySuccessSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  )
}

const styles: any = {
  container: {
    width: '100%',
    padding: '18px 0',
    boxSizing: 'border-box'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    overflow: 'hidden'
  },
  textAreaContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    padding: '12px',
    boxSizing: 'border-box',
    backgroundColor: '#F6FAFF'
  },
  textArea: {
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'none',
    lineHeight: '1.5',
    backgroundColor: '#F6FAFF'
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#F6FAFF'
  },
  iconButtons: {
    display: 'flex',
    gap: '20px'
  },
  icon: {
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
    '&:focus': { outline: 'none' },
    '&:focus-visible': { outline: 'none' },
    height: '20px',
    width: '20px'
  },
  sendButton: {
    borderRadius: '20px',
    padding: '7px 20px',
    border: '1px solid #858585',
    '&:focus': { outline: 'none' },
    '&:focus-visible': { outline: 'none' }
  },
  sendIcon: {
    width: '20px',
    height: '20px'
  },
  finishButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '12px',
    padding: '12px 0',
    textTransform: 'none',
    marginTop: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
  }
}

export default PromptInput
  