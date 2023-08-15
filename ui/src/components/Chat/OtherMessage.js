// src/components/Chat/OtherMessage.js
import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
  background-color: #1976d2;
  border-radius: 5px;
  padding: 10px;
`;

const MessageContent = styled.p`
  font-size: 17px;
  color: white;
`;

const MessageDetails = styled.p`
  font-size: 12px;
  color: lightgray;
  margin-top: -10px;
`;

function OtherMessage({ content, senderId, senderName, createdAt }) {
  return (
    <MessageContainer>
      <MessageContent>{content}</MessageContent>
      <MessageDetails>{senderName} at {new Date(createdAt).toLocaleTimeString()}</MessageDetails>
    </MessageContainer>
  );
}

export default OtherMessage;
