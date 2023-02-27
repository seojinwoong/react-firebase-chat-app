import React from 'react';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';
import Favorites from './Favorites';
import UserPanel from './UserPanel';

const SidePanel = () => {
  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        color: '#fff',
        minWidth: '275px'
      }}
    >
      <UserPanel />
      
      <Favorites />
      
      <ChatRooms />
      
      <DirectMessages />
      
    </div>
  )
}

export default SidePanel