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

interface ToolsContentProps {
  brushSize: number
  setBrushSize: React.Dispatch<React.SetStateAction<number>>
}

const ToolsContent: React.FC<ToolsContentProps> = ({ brushSize, setBrushSize }) => {
  const [activeTool, setActiveTool] = useState<string>('brush')
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
        gap: '20px',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.2rem',
          width: '100%',
        }}
      >
        <IconButton
          onClick={handleUndo}
          sx={{
            borderRadius: '0.4rem',
            backgroundColor: activeTool === 'undo' ?  '#007bff' : '#EDEDED',
            color: activeTool === 'undo' ? '#fff' : 'inherit', 
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'undo' ?  '#007bff' : '#D3D3D3',
            },
          }}
        >
          <UndoIcon />
        </IconButton>

        <IconButton
          onClick={handleRedo}
          sx={{
            borderRadius: '0.4rem',
            backgroundColor: activeTool === 'redo' ?  '#007bff' : '#EDEDED',
            color: activeTool === 'redo' ? '#fff' : 'inherit', 
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'redo' ?  '#007bff' : '#D3D3D3',
            },
          }}
        >
          <RedoIcon />
        </IconButton>

        <IconButton
          onClick={handleRestart}
          sx={{
            borderRadius: '8px',
            backgroundColor: activeTool === 'restart' ?  '#007bff' : '#EDEDED',
            color: activeTool === 'restart' ? '#fff' : 'inherit', 
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'restart' ?  '#007bff' : '#D3D3D3',
            },
          }}
        >
          <LoopIcon />
        </IconButton>

        <IconButton
          onClick={handleZoomIn}
          sx={{
            borderRadius: '8px',
            backgroundColor: activeTool === 'zoomin' ?  '#007bff' : '#EDEDED',
            color: activeTool === 'zoomin' ? '#fff' : 'inherit', 
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'zoomin' ?  '#007bff' : '#D3D3D3',
            },
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
          width: '100%',
        }}
      >
        <IconButton
          onClick={() => setActiveTool('brush')}
          sx={{
            backgroundColor: activeTool === 'brush' ? '#007bff' : '#EDEDED',
            color: activeTool === 'brush' ? '#fff' : 'inherit', // White icon when active
            borderRadius: '8px',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'brush' ? '#007bff' : '#D3D3D3',
            },
          }}
        >
          <BrushIcon />
        </IconButton>

        <Slider
          value={brushSize}
          onChange={(_, value) => {
            setBrushSize(value as number)
            setActiveTool('brush')
          }}
          aria-label="Brush Size"
          sx={{
            flexGrow: 1,
            color: activeTool === 'brush' ? '#007bff' : '#EDEDED',
          }}
        />
      </Box>

      <Box
        onClick={() => setActiveTool('eraser')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <IconButton
          sx={{
            backgroundColor: activeTool === 'eraser' ? '#007bff' : '#EDEDED',
            color: activeTool === 'eraser' ? '#fff' : 'inherit', // White icon when active
            borderRadius: '8px',
            width: '4rem',
            height: '3.5rem',
            '&:focus': { outline: 'none' },
            '&:hover': {
              backgroundColor: activeTool === 'eraser' ? '#007bff' : '#D3D3D3',
            },
          }}
        >
          <FormatPaintIcon />
        </IconButton>

        <Slider
          value={eraserSize}
          onChange={(_, value) => {
            setEraserSize(value as number)
            setActiveTool('eraser')
          }}
          aria-label="Eraser Size"
          sx={{
            flexGrow: 1,
            color: activeTool === 'eraser' ? '#007bff' : '#EDEDED',
          }}
        />
      </Box>
    </Box>
  )
}

export default ToolsContent
