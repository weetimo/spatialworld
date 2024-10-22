import React from 'react'
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
import Critique from './critique'

interface CritiqueDialogProps {
  open: boolean
  onClose: () => void
  critique?: string
}

const CritiqueDialog: React.FC<CritiqueDialogProps> = ({ open, onClose, critique }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: '60vh' } }}>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Critique
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Critique critique={critique} />
      </DialogContent>
    </Dialog>
  )
}

export default CritiqueDialog
