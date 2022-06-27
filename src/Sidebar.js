import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Avatar, IconButton } from '@mui/material';
import { MoreVert, SearchOutlined, Home } from '@mui/icons-material';
import SidebarChat from './SidebarChat';
import db from './firebase';
import { useStateValue } from './StateProvider';
import SignOut from './SignOut';
import { Link } from 'react-router-dom';

function Sidebar(props) {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('');
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = db.collection('rooms').onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const findRooms = (str) => {
    if (rooms !== []) {
      const filteredRooms = rooms.filter((room) => {
        const roomName = room.data.name.toLowerCase();
        return roomName.includes(str);
      });
      return filteredRooms;
    }
  };

  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src={user?.photoURL} />
        <div className='sidebar__headerRight'>
          <IconButton>
            <Link to='/'>
              <Home />
            </Link>
          </IconButton>
          <IconButton>
            <SignOut />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutlined />
          <form>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
              type='text'
              placeholder='Search a chat room'
            />
          </form>
        </div>
      </div>
      <div className='sidebar__chats'>
        <SidebarChat addNewChat />
        {filter === ''
          ? rooms.map((room) => (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            ))
          : findRooms(filter).map((room) => (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            ))}
      </div>
    </div>
  );
}

export default Sidebar;
