// src/components/Chat/ChatBox.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import MyMessage from './MyMessage';
import SupervisorMessage from './SupervisorMessage';
import SendMessageForm from './SendMessageForm';
import axios from 'axios';
import { AuthProvider, AuthContext } from '../../context/auth'; // Added AuthContext
import { useAuth } from '../../context/auth'; // Corrected path to useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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

let ws;

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate(); // Initialize useNavigate
    const { currentUser } = useAuth();

    useEffect(() => {
    if (!currentUser) {
        navigate('/login');
    }
    }, [currentUser, navigate]);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    
    useEffect(() => {
        // Create a new WebSocket connection when the component mounts
        ws = new WebSocket(`ws://localhost:3000/chat-socket?conversationId=${currentUser._id}`);
    
        ws.onopen = () => {
          // Connection is opened
          console.log('WebSocket connection open');
        };
    
        ws.onmessage = (message) => {
          // Message is received
          const newMessage = JSON.parse(message.data);
          setMessages([...messages, newMessage]);
        };
    
        ws.onerror = (error) => {
          // Error occurred
          console.error('WebSocket error: ', error);
        };
    
        ws.onclose = () => {
          // Connection is closed
          console.log('WebSocket connection closed');
        };
    
        return () => {
          // Clean up the WebSocket connection when the component unmounts
          ws.close();
        };
    }, []);

        
    useEffect(() => {
        axios.get('http://localhost:3000/chat/get-messages', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            })
            .then(response => {
                //console.log('#### The received messages are: ', response.data.conversation)
                setMessages(response.data.conversation);
            })
            .catch(error => {
                console.error('Error fetching messages: ', error);
            });
    }, []);

    useEffect(scrollToBottom, [messages]);

    

    const handleSend = (messageContent) => {
        // Sending a new message using the WebSocket connection
        const message = {
          content: messageContent,
          sender: currentUser.email,
        };
        ws.send(JSON.stringify(message));
    
        // Optimistically adding the new message to the UI here
        const newMessage = {
          content: messageContent,
          sender: currentUser.email,
          createdAt: new Date(),
        };
        setMessages([...messages, newMessage]);
    };
    
      

    console.log("This is the exact messages: ", messages);
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

export default ChatBox;
