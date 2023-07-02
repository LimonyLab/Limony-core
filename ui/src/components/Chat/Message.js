// src/components/Chat/Message.js
import React from 'react';

function Message({ content, sender, timestamp }) {
  return (
    <div>
      <p>{content}</p>
      <small>{sender} at {new Date(timestamp).toLocaleTimeString()}</small>
    </div>
  );
}

export default Message;
