import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import db from './firebase';
import AddIcon from '@mui/icons-material/Add';

export default function CreateChat() {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    db.collection('rooms')
      .add({
        name: roomName,
      })
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error('Error creating document: ', error);
      });
  };
  return (
    <div>
      <AddIcon variant='outlined' onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new chatroom!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new chat room, please enter a new chat room name below.
          </DialogContentText>
          <Input
            fullWidth
            autoFocus
            type='text'
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
            value={roomName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
