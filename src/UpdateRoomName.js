import React, { useState, useEffect } from 'react';
import EditRoadOutlinedIcon from '@mui/icons-material/EditRoadOutlined';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import db from './firebase';

export default function UpdateRoomName({ id, name }) {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (name) {
      setRoomName(name);
    }
  }, [name]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    db.collection('rooms')
      .doc(id)
      .update({
        name: roomName,
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
      <EditRoadOutlinedIcon variant='outlined' onClick={handleClickOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit room name !</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update a room name, please enter a new room name below.
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
