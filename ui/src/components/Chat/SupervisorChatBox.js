// src/components/Chat/SupervisorChatBox.js
import React, { useEffect, useState, useRef, useContext } from 'react';
import MyMessage from './MyMessage';
import SupervisorMessage from './SupervisorMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthContext } from '../../context/auth';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 280vh;
  overflow: auto;
  margin: 1em;
  padding: 1em;
  width:50%;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`;


function SupervisorChatBox({ conversationId }) {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const { authToken } = useContext(AuthContext);
  
    const navigate = useNavigate();
    const { currentUser } = useAuth();
  
    const messagesEndRef = useRef(null)
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
      if (!currentUser) {
        navigate('/login');
      }
    }, [currentUser, navigate]);
  
    // Add useEffect to establish WebSocket connection when the component mounts
    useEffect(() => {
        const wsConnection = new WebSocket(`ws://localhost:3000/chat?conversationId=${conversationId}`);      
        wsConnection.onopen = () => console.log('connected to websocket');
        wsConnection.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setMessages(prev => [...prev, data]);
        };
        setWs(wsConnection);
        return () => {
            wsConnection.close();
        };

    }, [conversationId]);
  
    useEffect(scrollToBottom, [messages]);
  
    const handleSend = (messageContent) => {
      console.log('Our authorization bearer token is: ', authToken);
  
      const newMessage = {
        content: messageContent,
        sender: currentUser.email,
        createdAt: new Date(),
      };
  
      // Send the new message over the WebSocket
      ws.send(JSON.stringify(newMessage));
  
      // Optimistically add the new message to the state
      setMessages(prev => [...prev, newMessage]);
    };
  
    return (
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message, index) =>
            message.sender === 'supervisor@supervisor.com'
              ? <SupervisorMessage key={index} {...message} />
              : <MyMessage key={index} {...message} />
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <SendMessageForm onSend={handleSend} />
      </ChatContainer>
    );
  }
  
export default SupervisorChatBox;