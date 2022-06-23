import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@mui/material';
import {
  MoreVert,
  SearchOutlined,
  AttachFile,
  InsertEmoticon,
  Mic,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase/compat/app';
import { useStateValue } from './StateProvider';
import UpdateMessage from './UpdateMessage';
import RemoveIcon from '@mui/icons-material/Remove';

function Chat() {
  const [input, setInput] = useState('');
  const [seed, setSeed] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [roomId]);

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('rooms').doc(roomId).collection('messages').add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput('');
  };

  const removeMessage = (messageID) => {
    db.collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc(messageID)
      .delete()
      .then(() => {
        console.log('message successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  };

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.png`} />
        <div className='chat__headerInfo'>
          <h3 className='chat-room-name'>{roomName}</h3>
          <p className='chat-room-last-seen'>
            Last seen{' '}
            {new Date(
              messages[messages.length - 1]?.data.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='chat__body'>
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.data.name === user.displayName && 'chat__receiver'
            }`}
          >
            <span className='chat__photo'>
              <Avatar src={user.photoUrl} />
            </span>
            <div className='chat__name'>
              {message.data.name}
              {message.data.name === user.displayName ? (
                <>
                  <span className='chat__editbutton'>
                    <UpdateMessage
                      messageId={message.id}
                      roomId={roomId}
                      messageInput={message.data.message}
                    />
                  </span>
                  <span className='chat__removeButton'>
                    <RemoveIcon onClick={() => removeMessage(message.id)} />
                  </span>
                </>
              ) : (
                ''
              )}
            </div>
            {message.data.message}

            <span className='chat__timestemp'>
              {new Date(message.data.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='chat__footer'>
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type='text'
            placeholder='Type a message'
          />
          <button type='submit' onClick={sendMessage}>
            Send a Message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
