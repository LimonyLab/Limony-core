// src/components/Chat/Message.js
import React from 'react';

function Message({ content, sender, createdAt, updatedAt }) {
  console.log('In Message, I have content: ', content);

  return (
    <div style={{ margin: '10px 0' }}>
      <p style={{ fontSize: '17px', color: 'White' }}>{content}</p>
      <p style={{ fontSize: '12px', color: 'green', marginTop: '-20px' }}>{sender} at {new Date(createdAt).toLocaleTimeString()}</p>
    </div>
  );
}

export default Message;
