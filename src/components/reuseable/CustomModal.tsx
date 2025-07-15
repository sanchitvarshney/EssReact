import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface CustomModalProps {
  open: boolean;
  onClose?:  any;
  title?: string;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      open={open}
      onClose={(reason) => {
        if (reason !== 'backdropClick') {
          onClose(false);
        }
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          userSelect: 'none',
        },
      }}
  
    >
      <DialogTitle sx={{ color: 'text.primary' }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={() => onClose(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          overflowY: 'auto',
          flex: 1,
          mt: 1,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
