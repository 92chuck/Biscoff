import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Avatar } from '@mui/material';
import db from './firebase';
import { Link, useHistory } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import UpdateRoomName from './UpdateRoomName';
import CreateChat from './CreateChat';

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState('');
  const [messages, setMessages] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const removeChat = (id) => {
    db.collection('rooms')
      .doc(id)
      .delete()
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  return !addNewChat ? (
    <div className='sidebarChat'>
      <div className='sidebarChat__buttons'>
        <UpdateRoomName id={id} name={name} />
        <Delete onClick={() => removeChat(id)} />
      </div>
      <Avatar
        src={`https://avatars.dicebear.com/api/croodles/${seed}.png`}
        sx={{ height: '55px', width: '55px' }}
      />
      <Link to={`/rooms/${id}`} key={id}>
        <div className='sidebarChat__info'>
          <h2>{name}</h2>
          <p>
            {messages[0]?.message.includes('https://')
              ? 'image'
              : messages[0]?.message}
          </p>
        </div>
      </Link>
    </div>
  ) : (
    <div className='sidebarChat'>
      <h3 className='add-new-chat-title'>Create a channel</h3>
      <span className='createChat__button'>
        <CreateChat />
      </span>
    </div>
  );
}

export default SidebarChat;
