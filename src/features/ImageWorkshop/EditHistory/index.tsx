import React from 'react'
import { Box, Typography } from '@mui/material'
import { History } from '../Prompt'

const EditHistory: React.FC<History> = ({ history }) => {
  const doesHistoryExist = history.prompt.trim() !== ''

  return (
    <Box
      sx={{
        marginTop: '16px',
        border: '1px solid #858585',
        borderRadius: '12px',
        padding: '8px',
      }}
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        Edit History
      </Typography>

      <Typography variant="body1" sx={{ mb: 1, display: doesHistoryExist ? 'none' : 'block', color: '#a7a7a7' }}>
        No existing history, please click on the &quot;Tools&quot; tab to start editing.
      </Typography>

      <Box
        sx={{
          alignItems: 'center',
          marginBottom: '12px',
          padding: '8px',
          borderRadius: '8px',
          display: doesHistoryExist ? 'flex' : 'none' 
        }}
      >
        <Box
          component="img"
          src={history.image}
          alt={'Edit History'}
          sx={{
            width: '30%',
            height: 'auto',
            borderRadius: '8px',
            marginRight: '16px',
          }}
        />
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold' }}>Prompt:</span> {history.prompt}
        </Typography>
      </Box>
    </Box>
  )
}

export default EditHistory
