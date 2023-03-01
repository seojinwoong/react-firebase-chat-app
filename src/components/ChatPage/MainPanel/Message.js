import React from 'react';
import moment from 'moment';

const Message = ({ message, user }) => {
  const timeFromNow = timestamp => moment(timestamp).fromNow();

  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid
    }
  }

  const isImage = message => message.hasOwnProperty('image') && !message.hasOwnProperty('content');

  return (
    <div style={{ marginBottom: '3px', display: 'flex' }}>
      <img
        style={{ borderRadius: '10px' }}
        width={48}
        height={48}
        className="mr-3"
        src={message.user.image}
        alt={message.user.name}
      />

      <div style={{ backgroundColor: isMessageMine(message, user) && '#ececec' }}>
        <h6>
          {message.user.name}{" "}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timestamp)}
          </span>
        </h6>

        {
          isImage(message) 
          ? <img style={{ maxWidth: '300px' }} alt="user thumbnail" src={message.imagee} />
          : <p>{message.content}</p>
        }
      </div>
    </div>
  )
}

export default Message