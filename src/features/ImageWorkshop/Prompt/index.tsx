import React, { useState } from 'react'
import { Box, IconButton, TextareaAutosize } from '@mui/material'
import { ContentCopy as ContentCopyIcon, Send as SendIcon, Loop as ResetIcon } from '@mui/icons-material'
import EditHistory from '../EditHistory'

export interface History {
  history: { image: string; prompt: string}
  disabled?: boolean
}

const Prompt: React.FC<History> = ({ history, disabled }) => {
  const [prompt, setPrompt] = useState(history.prompt)

  const handleCopyPrompt = (): void => {
    navigator.clipboard.writeText(prompt)
  }

  const handleResetPrompt = (): void => {
    setPrompt('')
  }

  const handleProcessPrompt = (): void => {
    console.log('Send button clicked: ', prompt)
  }

  return (
    <Box sx={{ mt: '-1rem', width: '100%' }}>
      <Box
        sx={{
          border: '1px solid #858585',
          borderRadius: '12px',
          padding: '0.2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <TextareaAutosize
            aria-label="input prompt"
            minRows={4}
            placeholder="Input here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              padding: '8px',
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'none',
              flexGrow: 1,
              backgroundColor: 'transparent'
            }}
          />
        </Box>

        <Box
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: '8px',
            padding: '0 8px',
            display: disabled ? 'none' : 'flex'
          }}
        >
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <IconButton 
              onClick={handleCopyPrompt}
              sx={{
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton 
              onClick={handleResetPrompt}
              sx={{
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
            >
              <ResetIcon />
            </IconButton>
          </Box>

          <IconButton 
            onClick={handleProcessPrompt}
            sx={{
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: 'none' }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      <EditHistory history={history} />
    </Box>
  )
}

export default Prompt
