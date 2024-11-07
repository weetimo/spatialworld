import React from 'react';
import { Box, IconButton, TextareaAutosize, Button } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Loop as ResetIcon } from '@mui/icons-material';
import EditHistory from '../EditHistory';
import starIcon from '../../../assets/icons/ai.png';
import activeStarIcon from '../../../assets/icons/ai-white.png'; // Active icon

// ========================
// Type Definitions
// ========================

export interface History {
  image: string;
  prompt: string;
}

interface PromptProps {
  history: History;
  promptText: string;
  setPromptText: React.Dispatch<React.SetStateAction<string>>;
  isImageEdited: boolean;
  handleSend: () => void;
  loading: boolean; // Receive loading prop
}

// ========================
// Prompt Component
// ========================

const Prompt: React.FC<PromptProps> = ({
  history,
  promptText,
  setPromptText,
  isImageEdited,
  handleSend,
  loading
}) => {
  // ========================
  // Event Handlers
  // ========================

  // Copies the prompt text to clipboard
  const handleCopyPrompt = (): void => {
    navigator.clipboard.writeText(promptText);
  };

  // Resets the prompt text to an empty string
  const handleResetPrompt = (): void => {
    setPromptText('');
  };

  // Determines if the send button should be active
  const isActive = isImageEdited && promptText.length > 0 && !loading;

  // ========================
  // Render
  // ========================

  return (
    <Box
      sx={{
        width: '100%',
        padding: '18px 0px',
        boxSizing: 'border-box',
      }}
    >
      {/* Prompt Input Box */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Textarea for Prompt Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            padding: '12px 12px 0 12px',
            boxSizing: 'border-box',
            backgroundColor: '#F6FAFF',
          }}
        >
          <TextareaAutosize
            aria-label="input prompt"
            minRows={4}
            placeholder="Input here"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'none',
              lineHeight: '1.5',
              backgroundColor: '#F6FAFF',
            }}
          />
        </Box>

        {/* Action Buttons (Copy, Reset, Send) */}
        <Box
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            display: 'flex',
            backgroundColor: '#F6FAFF',
          }}
        >
          {/* Copy and Reset Icons */}
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <IconButton
              onClick={handleCopyPrompt}
              size="small"
              disabled={loading}
              sx={{
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' },
                height: '20px',
                width: '20px',
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              onClick={handleResetPrompt}
              size="small"
              disabled={loading}
              sx={{
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' },
                height: '20px',
                width: '20px',
              }}
            >
              <ResetIcon />
            </IconButton>
          </Box>

          {/* Send Button */}
          <IconButton
            onClick={handleSend}
            disabled={!isActive}
            sx={{
              borderRadius: '20px',
              padding: '7px 20px',
              border: '1px solid #858585',
              backgroundColor: isActive ? '#007bff' : 'default',
              '&:hover': {
                backgroundColor: isActive ? '#007bff' : 'rgba(0, 0, 0, 0.04)',
              },
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: 'none' },
            }}
          >
            <Box
              component="img"
              src={isActive ? activeStarIcon : starIcon} 
              alt="Send"
              sx={{ width: '20px', height: '20px' }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Edit History Section */}
      <EditHistory history={history} />

      {/* Finish Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{
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
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            // Optional hover effect
          },
        }}
      >
        Finish
      </Button>
    </Box>
  );
};


export default Prompt;
