import React from 'react';
import { Box, Typography } from '@mui/material';
import { History } from '../Prompt';

interface EditHistoryProps {
  history: History;
}

const EditHistory: React.FC<EditHistoryProps> = ({ history }) => {
  const doesHistoryExist = history.prompt.trim() !== '';

  return (
    <Box
      sx={{
        marginTop: '20px',
        borderRadius: '20px',
        padding: '16px',
        backgroundColor: '#F6FAFF',
      }}
    >
      <Typography variant="body1" sx={{fontWeight: 'bold' }}>
        Edit History
      </Typography>

      {!doesHistoryExist && (
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            color: '#a7a7a7',
          }}
        >
          No existing history.
        </Typography>
      )}

      {doesHistoryExist && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px', // Spacing between image and text
            marginTop: '12px',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow
          }}
        >
          <Box
            component="img"
            src={history.image}
            alt="Edit History"
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover', 
            }}
          />

          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <span style={{ fontWeight: 'bold' }}>Prompt:</span> {history.prompt}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditHistory;
