// src/components/Chat/SupervisorMessage.js
import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
  background-color: #00396e;
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

function SupervisorMessage({ content, sender, createdAt }) {
  return (
    <MessageContainer>
      <MessageContent>{content}</MessageContent>
      <MessageDetails>{sender} at {new Date(createdAt).toLocaleTimeString()}</MessageDetails>
    </MessageContainer>
  );
}

export default SupervisorMessage;
