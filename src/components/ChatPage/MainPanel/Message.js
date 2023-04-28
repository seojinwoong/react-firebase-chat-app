import React from 'react';
import moment from 'moment';

const Message = ({message, user}) => {
  const timeFromNow = timestamp => moment(timestamp).fromNow();
  const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
  }

  const isMineMessage = (messageId, currentUserId) => messageId === currentUserId;
    

  return (
      <div style={{ display: 'flex', marginBottom: '5px', backgroundColor: isMineMessage(message.user.id, user.uid) && '#ececec' }}>
        <img className="user_thumbnail" src={message.user.image} alt={message.user.name} style={{ width: '50px' }}/>
        <div className='user_chat_info'>
          <p className='user_name'>
            <span>{message.user.name}</span>
            <span style={{ fontSize: '11px', color: 'gray' }}>{timeFromNow(message.timestamp)}</span>
          </p>
          <p className='user_chat_content'>
            {
              isImage(message)
              ? <img src={message.user.image} />
              : <span>{message.content}</span>
            }
          </p>
        </div>
      </div>
  )
}

export default Message