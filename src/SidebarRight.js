import React, { useState, useEffect } from 'react';
import './SidebarRight.css';
import { SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import db from './firebase';

function SidebarRight() {
  const [users, setUsers] = useState();

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className='sidebarRight'>
      <div className='sidebarRight__header'>
        <h4>Online Users</h4>
      </div>
      <div className='sidebarRight__body'>
        {users?.map((user) => (
          <div key={user.id}>
            <div className='sidebarRight__user'>
              <div className='sidebarRight__userphoto'>
                <Avatar
                  src={user.data.photoUrl}
                  sx={{
                    marginBottom: '12px',
                    borderRadius: '10px',
                  }}
                />
                <span>●</span>
              </div>

              <h2>{user.data.username}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SidebarRight;
