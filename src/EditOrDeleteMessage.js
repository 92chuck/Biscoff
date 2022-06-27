import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import db from './firebase';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';

export default function EditOrDeleteMessage({ messageId, roomId, messageInput }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (messageInput) {
      setMessage(messageInput);
    }
  }, [messageInput]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const removeMessage = (messageID) => {
    db.collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc(messageID)
      .delete()
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  const handleSubmit = () => {
    db.collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc(messageId)
      .update({
        message: message,
      })
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };
  return (
    <div>
      <EditAttributesIcon variant='outlined' onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>Edit a message !</DialogTitle>
        <DialogContent position='center'>
          <DialogContentText>
            To edit a message, please enter a new message below.
          </DialogContentText>
          <Input
            fullWidth
            autoFocus
            type='text'
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              removeMessage(messageId);
            }}
          >
            Delete
          </Button>
          <Button onClick={handleSubmit}>Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
