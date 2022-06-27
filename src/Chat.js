import React, { createRef, useState, useEffect, useRef } from 'react';
import './Chat.css';
import { Avatar, IconButton, CardMedia } from '@mui/material';
import {
  MoreVert,
  SearchOutlined,
  AttachFile,
  InsertEmoticon,
  Mic,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import db, { storage } from './firebase';
import firebase from 'firebase/compat/app';
import { useStateValue } from './StateProvider';
import EditOrDeleteMessage from './EditOrDeleteMessage';
import Picker from 'emoji-picker-react';

function Chat() {
  const inputRef = createRef();
  const [input, setInput] = useState('');
  const [seed, setSeed] = useState('');
  const [search, setSearch] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [cursorPosition, setCursorPosition] = useState();
  const [filter, setFilter] = useState('');
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
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
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const chooseImage = () => {
    document.getElementById('imageFile').click();
  };

  const searchOpen = () => {
    setSearch(!search);
  };

  const emojiOpen = () => {
    inputRef.current.focus();
    setEmoji(!emoji);
  };

  const onEmojiClick = (event, { emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = input.substring(0, ref.selectionStart);
    const end = input.substring(ref.selectionStart);
    const text = start + emoji + end;
    setInput(text);
    setCursorPosition(start.length + emoji.length);
  };
  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const findMessage = (str) => {
    if (messages !== []) {
      const filteredmsg = messages.filter((msg) => {
        const message = msg.data.message.toLowerCase();
        if (message.includes('https://')) {
          return false;
        }
        return message.includes(str);
      });
      return filteredmsg;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('rooms').doc(roomId).collection('messages').add({
      message: input,
      name: user.displayName,
      photoUrl: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput('');
    setEmoji(false);
  };

  const sendImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file.type.match('image')) {
      alert('Please select image only');
    } else {
      const fileRef = storage.ref().child(file.name);
      await fileRef.put(file);
      const imageRef = storage.ref(file.name);
      const imageUrl = await imageRef.getDownloadURL();
      db.collection('rooms').doc(roomId).collection('messages').add({
        message: imageUrl,
        name: user.displayName,
        photoUrl: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar
          src={`https://avatars.dicebear.com/api/croodles/${seed}.png`}
          sx={{ height: '60px', width: '60px' }}
        />
        <div className='chat__headerInfo'>
          <h3 className='chat-room-name'>{roomName}</h3>
          <p className='chat-room-last-seen'>
            Last seen{' '}
            {messages.length === 0
              ? ''
              : new Date(
                  messages[messages.length - 1]?.data.timestamp?.toDate()
                ).toLocaleTimeString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
          </p>
        </div>
        <div className='chat__headerRight'>
          <IconButton
            onClick={() => {
              searchOpen();
            }}
          >
            <SearchOutlined />
          </IconButton>
          {!search ? (
            ''
          ) : (
            <input
              id='searchMsg'
              value={filter}
              type='text'
              onChange={(e) => {
                setFilter(e.target.value.toLowerCase());
              }}
              placeholder={'search a message'}
            />
          )}
          <IconButton
            onClick={() => {
              chooseImage();
            }}
          >
            <input
              style={{ display: 'none' }}
              type='file'
              id='imageFile'
              accept='image/*'
              onChange={(e) => sendImage(e)}
            />
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='chat__body'>
        {filter === ''
          ? messages.map((message) => (
              <li
                key={message.id}
                className={`chat__message ${
                  message.data.name === user.displayName && 'chat__receiver'
                }`}
              >
                <span className='chat__photo'>
                  <Avatar src={message.data.photoUrl} />
                </span>
                <div className='chat__name'>
                  {message.data.name}
                  {message.data.name === user.displayName ? (
                    <span className='chat__editbutton'>
                      <EditOrDeleteMessage
                        messageId={message.id}
                        roomId={roomId}
                        messageInput={message.data.message}
                      />
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                {message.data.message.includes('https://') ? (
                  <CardMedia
                    component='img'
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 233 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    src={message.data.message}
                  />
                ) : (
                  message.data.message
                )}
                <span className='chat__timestemp'>
                  {new Date(
                    message.data.timestamp?.toDate()
                  ).toLocaleTimeString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))
          : findMessage(filter).map((message) => (
              <li
                key={message.id}
                className={`chat__message ${
                  message.data.name === user.displayName && 'chat__receiver'
                }`}
              >
                <span className='chat__photo'>
                  <Avatar src={message.data.photoUrl} />
                </span>
                <div className='chat__name'>
                  {message.data.name}
                  {message.data.name === user.displayName ? (
                    <>
                      <span className='chat__editbutton'>
                        <EditOrDeleteMessage
                          messageId={message.id}
                          roomId={roomId}
                          messageInput={message.data.message}
                        />
                      </span>
                    </>
                  ) : (
                    ''
                  )}
                </div>
                {message.data.message.includes('https://') ? (
                  <CardMedia
                    component='img'
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 233 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    src={message.data.message}
                  />
                ) : (
                  message.data.message
                )}
                <span className='chat__timestemp'>
                  {new Date(
                    message.data.timestamp?.toDate()
                  ).toLocaleTimeString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
        <div ref={messagesEndRef} />
        {emoji ? (
          <div className='emoji'>
            <Picker
              onEmojiClick={onEmojiClick}
              pickerStyle={{ width: '40%', overflow: 'auto' }}
            />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='chat__footer'>
        <IconButton
          onClick={() => {
            emojiOpen();
          }}
        >
          <InsertEmoticon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type='text'
            placeholder='Type a message'
            ref={inputRef}
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
