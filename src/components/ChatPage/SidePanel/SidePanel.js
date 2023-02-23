import React from 'react';
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessage from './DirectMessage';

const SidePanel = () => {
  return (
    <div
        style={{
          backgroundColor: "#7B83EB",
          padding: '2rem',
          minHeight: '100vh',
          color: 'white',
          minWidth: '275px'
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessage />
    </div>
  )
}

export default SidePanel