import React, { useState } from 'react'
import { Box, IconButton, Slider } from '@mui/material'
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Loop as LoopIcon,
  ZoomIn as ZoomInIcon,
  Brush as BrushIcon,
  FormatPaint as FormatPaintIcon,
} from '@mui/icons-material'

const ToolsContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('brush')
  const [brushSize, setBrushSize] = useState(50)
  const [eraserSize, setEraserSize] = useState(50)

  const handleUndo = (): void => {
    setActiveTool('undo')
  }

  const handleRedo = (): void => {
    setActiveTool('redo')
  }

  const handleRestart = (): void => {
    setActiveTool('restart')
  }

  const handleZoomIn = (): void => {
    setActiveTool('zoomin')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        mt: '-0.5rem'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.2rem',
          width: '100%'
        }}
      >
        <IconButton
          onClick={handleUndo}
          sx={{
            borderRadius: '0.4rem',
            backgroundColor: activeTool === 'undo' ? '#F1C385' : '#EDEDED',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'undo' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          onClick={handleRedo}
          sx={{
            borderRadius: '0.4rem',
            backgroundColor: activeTool === 'redo' ? '#F1C385' : '#EDEDED',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'redo' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <RedoIcon />
        </IconButton>
        <IconButton
          onClick={handleRestart}
          sx={{
            borderRadius: '8px',
            backgroundColor: activeTool === 'restart' ? '#F1C385' : '#EDEDED',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'restart' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <LoopIcon />
        </IconButton>
        <IconButton
          onClick={handleZoomIn}
          sx={{
            borderRadius: '8px',
            backgroundColor: activeTool === 'zoomin' ? '#F1C385' : '#EDEDED',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'zoomin' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <ZoomInIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}
      >
        <IconButton
          onClick={() => setActiveTool('brush')}
          sx={{
            backgroundColor: activeTool === 'brush' ? '#F1C385' : '#EDEDED',
            borderRadius: '8px',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'brush' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <BrushIcon />
        </IconButton>
        <Slider
          value={brushSize}
          onChange={(_, value) => {
            setBrushSize(value as number);
            setActiveTool('brush')
          }}
          aria-label="Brush Size"
          sx={{
            flexGrow: 1,
            color: activeTool === 'brush' ? '#F1C385' : '#EDEDED'
          }}
        />
      </Box>

      <Box
        onClick={() => setActiveTool('eraser')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}
      >
        <IconButton
          sx={{
            backgroundColor: activeTool === 'eraser' ? '#F1C385' : '#EDEDED',
            borderRadius: '8px',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'eraser' ? '#F1C385' : '#D3D3D3',
            }
          }}
        >
          <FormatPaintIcon />
        </IconButton>
        <Slider
          value={eraserSize}
          onChange={(_, value) => {
            setEraserSize(value as number);
            setActiveTool('eraser')
          }}
          aria-label="Eraser Size"
          sx={{
            flexGrow: 1,
            color: activeTool === 'eraser' ? '#F1C385' : '#EDEDED'
          }}
        />
      </Box>
    </Box>
  )
}

export default ToolsContent
