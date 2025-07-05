
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface ConfirmationModalProps {
    open: boolean;
    close: () => void;
    aggree: () => void
    title: string;
    description?: string
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({open,close,title,description,aggree}) => {
  return (
     <React.Fragment>
    
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        {description &&<DialogContent>
           <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>}
        <DialogActions>
          <Button color='error' variant='outlined' sx={{ }} onClick={close}>Cancel</Button>
          <Button  variant='outlined' sx={{ color:"#2eacb3",}} onClick={aggree} autoFocus>
            Sure
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ConfirmationModal