import React from 'react';
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';


const SidePanel = () => {
  return (
    <div
      style={{
        backgroundColor: '#7b83eb',
        padding: '2rem',
        minHeight: '100vh',
        color: 'white',
        minWidth: '275px',
        height: '100%'
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessages />
    </div>
  )
}

export default SidePanel